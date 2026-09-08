// src/services/rag.service.ts
import { prisma } from "../lib/prisma.js";
import { getEmbedding } from "./embedding.service.js";
import { RerankerService } from "./reranker.service.js";

export class RagService {
  // 1. Guardar documento con su vector en la base de datos
  static async insertDocument(title: string, content: string) {
    const vector = await getEmbedding(content);
    const vectorString = `[${vector.join(",")}]`;

    // Insertamos mediante $executeRaw para castear a ::vector
    await prisma.$executeRaw`
      INSERT INTO "Document" (title, content, embedding)
      VALUES (${title}, ${content}, ${vectorString}::vector)
    `;

    return { message: "Documento vectorizado y guardado con éxito", title };
  }

  // 2. Búsqueda semántica usando el operador de distancia coseno (<=>)
  static async searchSimilar(query: string, limit = 3, threshold = 0.4) {
    const queryVector = await getEmbedding(query);
    const vectorString = `[${queryVector.join(",")}]`;

    // 1 - (embedding <=> queryVector) nos da la similitud coseno (entre 0 y 1)
    const results = await prisma.$queryRaw<
      Array<{ id: number; title: string; content: string; similarity: number }>
    >`
      SELECT 
        id, 
        title, 
        content, 
        1 - (embedding <=> ${vectorString}::vector) AS similarity
      FROM "Document"
      WHERE 1 - (embedding <=> ${vectorString}::vector) > ${threshold}
      ORDER BY similarity DESC
      LIMIT ${limit};
    `;

    return results;
  }

  // 3. RAG completo: Búsqueda + Prompt Aumentado
  static async askRAG(question: string) {
    // Paso A: Recuperar contexto relevante
    const docs = await this.searchSimilar(question, 2);

    if (docs.length === 0) {
      return {
        answer:
          "No encontré información relevante en la base de datos para responder a tu pregunta.",
        sources: [],
      };
    }

    // Paso B: Construir el contexto para el LLM
    const contextText = docs
      .map((d) => `- ${d.title}: ${d.content}`)
      .join("\n\n");

    const prompt = `
Contexto de la base de datos:
"""
${contextText}
"""

Pregunta del usuario: ${question}

Instrucciones: Responde a la pregunta basándote únicamente en el contexto proporcionado arriba.
`;

    // Aquí puedes llamar a OpenAI, Gemini, o devolver el prompt generado
    // para que tus alumnos vean cómo se "alimenta" al LLM
    return {
      promptGeneradoParaLLM: prompt,
      sources: docs,
    };
  }

  static async askRAGWithReranker(question: string) {
    // FASE 1: Recuperación amplia con pgvector
    // Traemos 6 documentos candidatos con un umbral más bajo (recuperación generosa)
    const initialCandidates = await this.searchSimilar(question, 6, 0.2);
    if (initialCandidates.length === 0) {
      return {
        message: "No se encontraron documentos candidatos.",
        candidatesFromVectorDB: [],
        rerankedResults: [],
      };
    }
    // FASE 2: Reordenamiento con el Cross-Encoder
    // Evaluamos los 6 y nos quedamos con los 2 mejores
    const topDocs = await RerankerService.rerank(
      question,
      initialCandidates,
      1,
    );
    // FASE 3: Generación con contexto refinado
    const contextText = topDocs
      .map((d) => `- ${d.title}: ${d.content}`)
      .join("\n\n");
    const prompt = `
Contexto de alta precisión (Filtrado por Reranker):
"""
${contextText}
"""
Pregunta: ${question}
Instrucciones: Responde a la pregunta basándote estrictamente en el contexto de arriba, dentro del contexto usa aquello que tenga mas que ver con la pregunta del usuario, si el contexto tiene informacion de varios vectores, usa solo el vector que tenga mayor rerankScore.
`;
    return {
      question,
      // Para que los alumnos puedan comparar el ANTES y el DESPUÉS:
      candidatosInicialesPgvector: initialCandidates.map((c) => ({
        title: c.title,
        vectorSimilarity: c.similarity,
      })),
      ganadoresTrasRerank: topDocs.map((d) => ({
        title: d.title,
        vectorSimilarity: d.similarity,
        rerankScore: d.rerankScore,
      })),
      promptGenerado: prompt,
    };
  }
}

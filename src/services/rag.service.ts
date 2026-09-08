// src/services/rag.service.ts
import { prisma } from "../lib/prisma.js";
import { getEmbedding } from "./embedding.service.js";

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
}

// src/services/reranker.service.ts
import { AutoTokenizer, AutoModelForSequenceClassification } from '@xenova/transformers';

let tokenizer: any = null;
let model: any = null;

export interface DocumentCandidate {
  id: number;
  title: string;
  content: string;
  similarity?: number;
}

export class RerankerService {
  // Inicializamos el modelo de reranking (pesa unos ~45MB)
  private static async init() {
    if (!model || !tokenizer) {
      const modelId = 'Xenova/ms-marco-MiniLM-L-6-v2';
      tokenizer = await AutoTokenizer.from_pretrained(modelId);
      model = await AutoModelForSequenceClassification.from_pretrained(modelId);
    }
  }

  /**
   * Toma la pregunta y una lista de documentos candidatos,
   * y los reordena asignando una puntuación de relevancia cruzada.
   */
  static async rerank(query: string, documents: DocumentCandidate[], topN = 2) {
    if (documents.length === 0) return [];

    await this.init();

    // 1. Preparamos los pares: la pregunta repetida para cada documento
    const inputs = await tokenizer(new Array(documents.length).fill(query), {
      text_pair: documents.map(doc => `${doc.title}: ${doc.content}`),
      padding: true,
      truncation: true,
    });

    // 2. Ejecutamos la clasificación cruzada
    const { logits } = await model(inputs);

    // 3. Convertimos los logits en una probabilidad/score de 0 a 1 usando sigmoide
    const rawScores = logits.data;
    const scoredDocs = documents.map((doc, idx) => {
      const logit = rawScores[idx];
      const rerankScore = 1 / (1 + Math.exp(-logit)); // Función Sigmoide
      return {
        ...doc,
        rerankScore: Number(rerankScore.toFixed(4)),
      };
    });

    // 4. Ordenamos de mayor a menor puntuación del Reranker y tomamos el Top N
    return scoredDocs
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, topN);
  }
}
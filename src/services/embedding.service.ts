// src/services/embedding.service.ts
import { pipeline } from '@xenova/transformers';

// Modelo ligero de 384 dimensiones que corre en local
let embedder: any = null;

export const getEmbedding = async (text: string): Promise<number[]> => {
  if (!embedder) {
    // Inicializa el modelo una sola vez (la primera vez descargará ~90MB)
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data);
};
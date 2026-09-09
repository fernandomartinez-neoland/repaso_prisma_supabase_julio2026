// src/controllers/rag.controller.ts
import { Request, Response } from 'express';
import { RagService } from '../services/rag/rag.service.js';

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "title y content son requeridos" });
    }
    const result = await RagService.insertDocument(title, content);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const searchDocuments = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "query es requerido" });
    }
    const results = await RagService.searchSimilar(query);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "question es requerido" });
    }
    const answer = await RagService.askRAG(question);
    res.json(answer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const askWithRerank = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "question es requerido" });
    }
    const result = await RagService.askRAGWithReranker(question);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
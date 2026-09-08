// src/routes/rag.route.ts
import { Router } from 'express';
import { createDocument, searchDocuments, askQuestion, askWithRerank } from '../controllers/rag.controller.js';


const router = Router();

router.post('/documents', createDocument);
router.post('/search', searchDocuments);
router.post('/ask', askQuestion);
router.post('/ask-rerank', askWithRerank);

export default router;
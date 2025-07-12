import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { saveMessage, getMessages, createConversation, getConversations, updateConversationTitle, deleteConversation } from '../controllers/chat.controller.js';

const prisma = new PrismaClient();
const router = Router();

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

/* GET chat page. */
router.get('/chat', isAuthenticated, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
    });
    res.render('chat', { title: 'Chat', user: user });
  } catch (error) {
    next(error);
  }
});

/* POST save message. */
router.post('/chat/message', isAuthenticated, saveMessage);

/* GET messages for a chat. */
router.get('/chat/messages/:chatId', isAuthenticated, getMessages);

/* POST create new conversation. */
router.post('/chat/conversation', isAuthenticated, createConversation);

/* GET all conversations for a user. */
router.get('/chat/conversations', isAuthenticated, getConversations);

/* PUT update conversation title. */
router.put('/chat/conversation/:conversationId', isAuthenticated, updateConversationTitle);

/* DELETE conversation. */
router.delete('/chat/conversation/:conversationId', isAuthenticated, deleteConversation);

export default router;

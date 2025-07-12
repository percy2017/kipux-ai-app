import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveMessage = async (req, res) => {
    const { chatId, role, content } = req.body;
    const userId = req.session.user ? req.session.user.id : null; // Asumiendo que el ID del usuario está en la sesión

    if (!chatId || !role || !content) {
        return res.status(400).json({ error: 'Faltan campos requeridos: chatId, role, content.' });
    }

    try {
        const dataToCreate = {
            role: role,
            content: content,
            conversation: {
                connect: { id: parseInt(chatId, 10) }
            }
        };

        if (userId) {
            dataToCreate.user = {
                connect: { id: userId }
            };
        }

        const message = await prisma.message.create({
            data: dataToCreate,
        });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor al guardar el mensaje.' });
    }
};

export const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.session.user ? req.session.user.id : null;

    if (!conversationId) {
        return res.status(400).json({ error: 'Falta el parámetro conversationId.' });
    }
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    try {
        // Eliminar mensajes asociados a la conversación
        await prisma.message.deleteMany({
            where: {
                conversationId: parseInt(conversationId),
                userId: userId,
            },
        });

        // Eliminar la conversación
        await prisma.conversation.delete({
            where: {
                id: parseInt(conversationId),
                userId: userId,
            },
        });
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error al eliminar la conversación:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la conversación.' });
    }
};

export const updateConversationTitle = async (req, res) => {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.session.user ? req.session.user.id : null;

    if (!conversationId || !title) {
        return res.status(400).json({ error: 'Faltan campos requeridos: conversationId, title.' });
    }
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    try {
        const conversation = await prisma.conversation.update({
            where: {
                id: parseInt(conversationId),
                userId: userId,
            },
            data: {
                title: title,
            },
        });
        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error al actualizar el título de la conversación:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el título de la conversación.' });
    }
};

export const createConversation = async (req, res) => {
    const { title } = req.body;
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    try {
        const conversation = await prisma.conversation.create({
            data: {
                userId: userId,
                title: title || 'Nuevo Chat',
            },
        });
        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error al crear la conversación:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear la conversación.' });
    }
};

export const getConversations = async (req, res) => {
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error al obtener las conversaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener las conversaciones.' });
    }
};

export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.session.user ? req.session.user.id : null;

    if (!chatId) {
        return res.status(400).json({ error: 'Falta el parámetro chatId.' });
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: parseInt(chatId),
                userId: userId, // Asegurar que solo se obtengan mensajes del usuario actual
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener los mensajes.' });
    }
};

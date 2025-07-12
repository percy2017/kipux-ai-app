import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const renderRegister = (req, res) => {
    res.render('register', { title: 'Register' });
};

export const registerUser = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
            },
        });
        console.log('Usuario registrado:', newUser);
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        // Pasamos el mensaje de error específico a la vista
        res.render('register', {
            title: 'Register',
            error: `An error occurred: ${error.message || 'Unknown error'}`,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        });
    }
};

export const renderLogin = (req, res) => {
    res.render('login', { title: 'Login' });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.render('login', { title: 'Login', error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { title: 'Login', error: 'Invalid email or password' });
        }

        // Store user info in session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        res.redirect('/chat');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { title: 'Login', error: 'An error occurred during login.' });
    }
};

export const updateUser = async (req, res) => {
    const { name, password } = req.body;
    const userId = req.session.user.id;

    try {
        const updateData = { name };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        // Update session user
        req.session.user.name = updatedUser.name;

        res.redirect('/chat');
    } catch (error) {
        console.error('Error updating user:', error);
        // A more robust error handling would be ideal here
        res.redirect('/chat');
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/chat'); // Or handle error appropriately
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        res.redirect('/');
    });
};

export const updateUserSettings = async (req, res) => {
    const userId = req.session.user.id;
    const { apiKey, liteLLMUrl, theme, defaultModel } = req.body;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                apiKey,
                liteLLMUrl,
                theme,
                defaultModel,
            },
        });
        res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

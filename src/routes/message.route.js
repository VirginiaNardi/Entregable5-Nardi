import express from 'express';
import Message from '../dao/models/chat.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new Message({ user, message });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Mensaje guardado correctamente' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ success: false, message: 'Error al guardar el mensaje' });
    }
});

export default router;

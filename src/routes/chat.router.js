import express from "express";

const createChatRouter = (socketServer) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("chat");
    });

    // Aquí puedes agregar más lógica de enrutamiento para el chat si es necesario

    return router;
};

export default createChatRouter;

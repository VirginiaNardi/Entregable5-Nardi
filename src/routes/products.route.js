import { Router } from "express";
import Products from "../dao/dbManager/product.js";

const router = Router();

const products = new Products();

router.get("/", async (req, res) => {
    try {
        const response = await products.getAll();
        res.json({
            message: "Lista de productos",
            data: response
        });
    } catch (error) {
        console.log("Error: ", error);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = products.getById(id);
        res.json(response)
    } catch (error) {
        console.log("Error: ", error);
    }
});

router.post("/", async (req, res) => {
    const { name, description, price, category,code, imageUrl, stock } = req.body;
    try {
        const response = await products.saveProduct({
            name,
            description,
            price,
            category,
            code,
            imageUrl,
            stock
        });
        res.json(response)
    } catch (error) {
        console.log('Error al crear el producto', error);
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category,code, imageUrl, stock } = req.body;

    try {
        const newProduct = { name, description, price, category,code, imageUrl, stock };

        const response = await products.updateProduct(id, newProduct);
        res.json(response);
    } catch (error) {
        console.log(`Error actualizando el producto ${id}`, error);
    };
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await products.deleteProduct(id);
        res.json(response);
    } catch (error) {
        console.log("Error eliminado el producto", error);
    }
});

export default router;
import { Router } from "express";
import Products from "../dao/dbManager/product.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ecommerce";  //cambiar url
const products = new Products(DB_URL)

router.get("/products", async (req, res) => {
    const response = await products.getAll();
    res.render("products", {
        title: "Lista de productos",
        products: response,
        style: "css/products.css"
    });
});

router.get("/realtime", async (req, res) => {
    const response = await products.getAll();
    res.render("realtime", {
        title: "Productos en tiempo real",
        products: response,
        style: "css/products.css",
    });
});
export default router

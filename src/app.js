import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import productRouter from "./routes/products.route.js";
import cartRouter from "./routes/cart.route.js";
import viewsRouter from "./routes/views.route.js";
import { __dirname } from "./utils.js";
import Products from "./dao/dbManager/product.js";
import chatRouter from "./routes/chat.router.js";
import messagesRouter from './routes/message.route.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const DB_URL = process.env.DB_URL || "mongodb+srv://virnardi:y8BhbPmy05ut5Sv1@cluster0.ij85089.mongodb.net/"
const productManager = new Products(DB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

////////////////////////////
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
////////////////////////////

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("Connected to MongoDB " + DB_URL);
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    })

const socketServer = new Server(server);
app.use("/chat", chatRouter(socketServer))
app.use('/api/messages', messagesRouter)

socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("addProduct", async (product) => {
        const name = product.name;
		const description = product.description;
		const price = product.price;
		const imageUrl = product.imageUrl;
		const code = product.code;
		const stock = product.stock;
        const newProduct = {name,description,price,imageUrl,code,stock}
        try {
            const result = await productManager.saveProduct(
                newProduct
            );

            const allProducts = await productManager.getAll();

            socketServer.emit("updateProducts", {
                allProducts,
                success: result.success,
                message: result.message,
            });
        } catch (error) {
            console.log(error);
            socketServer.emit("updateProducts", {
                success: false,
                message: error.message,
            });
        }
    })

    socket.on("deleteProduct", async (id) => {
        try {
            const result = await productManager.deleteProduct(id);
            const allProducts = await productManager.getAll();

            socketServer.emit("updateProducts", {
                allProducts,
                success: result.success,
				message: result.message,
            });
        } catch (error) {
            console.log(error)
        }
    });

    socket.on('chatMessage', async (data) => {
        const { user, message } = data;
        const newMessage = new Message({ user, message });
        await newMessage.save();
        socketServer.emit('chatMessage', { user, message });
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    
    
}); 

// import express from "express";
// import { Server as SocketServer } from "socket.io";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import handlebars from "express-handlebars";
// import productRouter from "./routes/products.route.js";
// import cartRouter from "./routes/cart.route.js";
// import viewsRouter from "./routes/views.route.js";
// import createChatRouter from "./routes/chat.router.js"; // Asegúrate de que esto exporte una función
// import { __dirname } from "./utils.js";
// import Products from "./dao/dbManager/product.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8080;

// // Asegúrate de que la URL de tu base de datos es correcta
// const DB_URL = process.env.DB_URL;

// const productManager = new Products(DB_URL);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));

// app.engine("handlebars", handlebars.engine());
// app.set("views", __dirname + "/views");
// app.set("view engine", "handlebars");

// app.use("/api/products", productRouter);
// app.use("/api/cart", cartRouter);
// app.use("/", viewsRouter);

// const server = app.listen(PORT, () => {
//     console.log(`Server is running on port http://localhost:${PORT}`);
// });

// mongoose.connect(DB_URL)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((error) => console.error("Error connecting to MongoDB", error));

// const socketServer = new SocketServer(server);

// // Mover la configuración de las rutas del chat aquí
// app.use("/chat", createChatRouter(socketServer));

// socketServer.on("connection", (socket) => {
//     console.log("Nuevo cliente conectado");
//     // Aquí viene el resto de tu lógica de sockets
//     socket.on("addProduct", async (product) => {
//                 const name = product.name;
//         		const description = product.description;
//         		const price = product.price;
//         		const imageUrl = product.imageUrl;
//         		const code = product.code;
//         		const stock = product.stock;
//                 const newProduct = {name,description,price,imageUrl,code,stock}
//                 try {
//                     const result = await productManager.saveProduct(
//                         newProduct
//                     );
        
//                     const allProducts = await productManager.getAll();
        
//                     socketServer.emit("updateProducts", {
//                         allProducts,
//                         success: result.success,
//                         message: result.message,
//                     });
//                 } catch (error) {
//                     console.log(error);
//                     socketServer.emit("updateProducts", {
//                         success: false,
//                         message: error.message,
//                     });
//                 }
//             })
        
//             socket.on("deleteProduct", async (id) => {
//                 try {
//                     const result = await productManager.deleteProduct(id);
//                     const allProducts = await productManager.getAll();
        
//                     socketServer.emit("updateProducts", {
//                         allProducts,
//                         success: result.success,
//         				message: result.message,
//                     });
//                 } catch (error) {
//                     console.log(error)
//                 }
//             });
// });

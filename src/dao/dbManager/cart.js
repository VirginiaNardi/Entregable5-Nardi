import cartsModel from "../models/cart.js";

class CartsManager {
  // Método para obtener todos los carritos
  getCarts = async () => {
    try {
      const carts = await cartsModel.find().lean().exec();
      return carts;
    } catch (error) {
      console.error(`Error al intentar obtener los carritos: ${error}`);
    }
  };

  // Método para obtener un carrito por su ID
  getCartById = async (id) => {
    try {
      const cart = await cartsModel.findById(id).lean().exec();
      return cart;
    } catch (error) {
      console.error(`Error al intentar obtener el carrito por su ID: ${error}`);
    }
  };

  // Método para crear un nuevo carrito
  addCart = async (cart) => {
    // Extraemos los datos del objeto cart
    const { product, quantity } = cart;

    // Validamos los datos
    if (typeof product !== 'string' || !product.trim() || isNaN(quantity) || quantity < 1) {
      console.error('Los datos del carrito son inválidos');
      return null; // Retorna null si los datos son inválidos
    }

    // Creamos el objeto de carrito formateado
    const formattedCart = {
      products: [{ product: product.trim(), quantity: Number(quantity) }]
    };

    try {
      // Creamos el nuevo carrito en la base de datos
      const newCart = await cartsModel.create(formattedCart);
      return newCart; // Retornamos el carrito creado
    } catch (error) {
      console.error(`Error al crear el carrito: ${error}`);
      return null; // Retorna null si ocurre un error al crear el carrito
    }
  };

  // Método para agregar un producto a un carrito existente
  addProduct = async (cid, pid) => {
    const newProduct = { product: pid, quantity: 1 };
    try {
      const cart = await cartsModel.findById(cid);
      const indexProduct = cart.products.findIndex((item) => item.product == pid);

      if (indexProduct < 0) {
        cart.products.push(newProduct);
      } else {
        cart.products[indexProduct].quantity += 1;
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error(`Error al intentar agregar un producto al carrito: ${error}`);
    }
  };
}

const cartsManager = new CartsManager();

export default cartsManager;

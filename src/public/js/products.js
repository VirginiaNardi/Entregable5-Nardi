const socket = io();

const addProductBtn = document.getElementById("addProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");
const productList = document.querySelector(".productList");

addProductBtn.addEventListener("click", () => {
    const name = document.getElementById("name");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const imageUrl = document.getElementById("imageUrl");
    const code = document.getElementById("code");
    const stock = document.getElementById("stock");

    const product = {
        name: name.value,
        description: description.value,
        price: price.value,
        imageUrl: imageUrl.value,
        code: code.value,
        stock: stock.value
    };

    socket.emit("addProduct", product);

    const card = document.createElement("div");
    card.classList.add("productCard");
    card.innerHTML = `
            <div class="cardProduct__image">
                <img src=${product.imageUrl} alt=${product.name} />
            </div>
            <div class="cardProduct__info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.stock}</p>
                <p>${product.code}</p>
            </div>
        `;
    productList.appendChild(card);

    name.value = "";
    description.value = "";
    price.value = "";
    imageUrl.value = "";
    code.value = "";
    stock.value = "";
});

deleteProductBtn.addEventListener("click", () => {
    const id = document.getElementById("productId");
    socket.emit("deleteProduct", id.value);
    id.value = "";
});

socket.on("updateProducts", (data) => {
    if (data.success) {
        productList.innerHTML = "";

        data.allProducts.forEach((product) => {
            const card = document.createElement("div");
            card.classList.add("productCard");
            card.innerHTML = `
            <div class="cardProduct__image">
                <img src=${product.imageUrl} alt=${product.name} />
            </div>
            <div class="cardProduct__info">

                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.stock}</p>
                <p>${product.code}</p>
            </div>
            `;
            productList.appendChild(card);
        });
        alert(data.message);
        return;
    } else {
        alert(data.message);
    }
});
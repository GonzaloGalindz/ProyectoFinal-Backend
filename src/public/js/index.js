const socketClient = io();

const formProd = document.getElementById("formProduct");
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const code = document.getElementById("code");
const tableProds = document.getElementById("bodyProd");
const formDelete = document.getElementById("deleteProduct");
const _id = document.getElementById("_id");

formProd.onsubmit = (e) => {
  e.preventDefault();
  const objProd = {
    title: title.value,
    description: description.value,
    price: Number(price.value),
    stock: Number(stock.value),
    code: code.value,
  };
  socketClient.emit("agregar", objProd);
  title.value = "";
  description.value = "";
  price.value = "";
  stock.value = "";
  code.value = "";
};

formDelete.onsubmit = (e) => {
  e.preventDefault();
  socketClient.emit("eliminar", _id.value);
  _id.value = "";
};

socketClient.on("added", (newProducts) => {
  if (!Array.isArray(newProducts)) {
    newProducts = [newProducts];
  }
  tableProds.innerHTML = "";

  const rows = newProducts
    .map(
      (product) => `<tr>
    <td style="padding: 0.7rem;border: 1px solid black;">${product._id}</td>
    <td style="padding: 0.7rem;border: 1px solid black;">${product.title}</td>
    <td style="padding: 0.7rem;border: 1px solid black;">${product.description}</td>
    <td style="padding: 0.7rem;border: 1px solid black;">${product.price}</td>
    <td style="padding: 0.7rem;border: 1px solid black;">${product.stock}</td>
    <td style="padding: 0.7rem;border: 1px solid black;">${product.code}</td>
</tr>`
    )
    .join("");

  tableProds.innerHTML = rows;
});

socketClient.on("deleted", (arrProducts) => {
  if (!Array.isArray(arrProducts)) {
    arrProducts = [arrProducts];
  }
  tableProds.innerHTML = "";

  const addRow = arrProducts
    .map((objProd) => {
      return `
              <tr>
                  <td style="padding: 0.7rem;border: 1px solid black;">${objProd._id}</td>
                  <td style="padding: 0.7rem;border: 1px solid black;">${objProd.title}</td>
                  <td style="padding: 0.7rem;border: 1px solid black;">${objProd.description}</td>
                  <td style="padding: 0.7rem;border: 1px solid black;">${objProd.price}</td>
                  <td style="padding: 0.7rem;border: 1px solid black;">${objProd.stock}</td>
                  <td style="padding: 0.7rem;border: 1px solid black;">${objProd.code}</td>
              </tr>`;
    })
    .join(" ");
  tableProds.innerHTML = addRow;
});

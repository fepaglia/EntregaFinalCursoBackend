const socket = io();

const form = document.getElementById('productForm');
const outProds = document.getElementById('liveProducts');


//Enviamos
addProduct.addEventListener('submit', e =>{
  e.preventDefault();
  
  const data = new FormData(form);
  
  const newProduct = {}

  data.forEach((value, key) => newProduct[key] = value);

  socket.emit('product', newProduct);
});

//Recibimos
socket.on('allProds', data =>{
  let products = ''
  data.forEach(product =>{
    products +=  `
    <div class="prodBox">
      <div><span>ID: </span><p>${product.id}</p></div>
      <div><span>Nombre: </span><p>${product.title}</p></div>
      <div><span>Precio: </span><p>${product.price}</p></div>
      <div><span>Descripcion: </span><p>${product.description}</p></div>
      <div><span>Thumbnails: </span><p>${product.thumbnails}</p></div>
      <div><span>Status: </span><p>${product.status}</p></div>
      <div><span>Status: </span><p>${product.code}</p></div>
      <div><span>Stock: </span><p>${product.stock}</p></div>
    </div>
    `;
    outProds.innerHTML = products;
  });

});
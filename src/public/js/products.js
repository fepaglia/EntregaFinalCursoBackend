document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCart');
  
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
  
            const productId = event.target.dataset.productId;
            const cartId = event.target.dataset.cart;
            const action = event.target.dataset.action;
  
            // Construir la URL para la solicitud a la API
            const url = `/api/carts/${cartId}/products/${productId}?action=${action}`;
  
            // Realizar la solicitud a la API
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(result =>{
                if(result.status === 200){        
                    location.href = "/products"
            }});
        });
    });
});
  
document.addEventListener('DOMContentLoaded', () => {
    const purchaseButton = document.querySelectorAll('.purchase');

    purchaseButton.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const cartId = event.target.dataset.cart;

            console.log(cartId);

            // Construir la URL para la solicitud a la API
            const url = `/api/carts/${cartId}/purchase`;

            // Realizar la solicitud a la API
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(result => {
                if(result.status === 201) {        
                    window.location.href = "/products";                
                }
            });
        });
    });

    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const cartId = event.target.dataset.cart;
            const productId = event.target.dataset.productId;

            // Construir la URL para la solicitud a la API
            const url = `/api/carts/${cartId}/products/${productId}?action=decrease`;

            // Realizar la solicitud a la API
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(result => {
                if (result.status === 200) {
                    location.reload(); // Actualizar la página después de la respuesta exitosa
                }
            });
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const cartId = event.target.dataset.cart;
            const productId = event.target.dataset.productId;

            // Construir la URL para la solicitud a la API
            const url = `/api/carts/${cartId}/products/${productId}?action=increase`;

            // Realizar la solicitud a la API
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(result => {
                if (result.status === 200) {
                    location.reload(); // Actualizar la página después de la respuesta exitosa
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const userTypeSelects = document.querySelectorAll('.userTypeSelect');

        userTypeSelects.forEach(userTypeSelect => {
            userTypeSelect.addEventListener('change', (event) => {
                event.preventDefault();
                const selectedOption = event.target.value;
                const email = event.target.dataset.email;

                const payload = {
                    email: email,
                    role: selectedOption
                };

                fetch(`/api/users`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 200) {        
                        window.location.replace('/users');
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            });
        });
});

const deleteUser = document.querySelectorAll('.deleteUser');

deleteUser.forEach(deleteUser =>{
    deleteUser.addEventListener('click', (event) =>{
        event.preventDefault(); 

        const email = event.target.dataset.email;

        const payload = {
            email: email
        };
        console.log(payload)


        fetch(`/api/users`, {
            method: 'DELETE',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 200) {        
                window.location.replace('/users');
            }
        })
        .catch(error => {
            console.error(error);
        });
    })
})
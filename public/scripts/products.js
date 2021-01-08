var heartIcons = document.querySelectorAll('.heart__icon');

heartIcons.forEach(heartIcon => {
    heartIcon.addEventListener('click', (e) => {
        var productId = e.target.getAttribute('product_id');

        if (e.target.classList.contains('added')) {

            e.target.classList.remove('added');
            axios.post(`/wishlist/remove/${productId}`)
                .then(response => console.log(response))
                .catch(err => console.log(err));


        }
        else {
            e.target.classList.add('added');
            axios.post(`/wishlist/add/${productId}`)
                .then(response => console.log(response))
                .catch(err => console.log(err));


        }
        location.reload();




    });


})

document.addEventListener('DOMContentLoaded', function(e){
    cartItemUrl = "http://localhost:3000/cart_items"
    usersCartUrl = "http://localhost:3000/users_carts"
    
    const itemUl = document.querySelector('.item')
    
    const renderCartItem = (cartItem) => {
        const itemLi = document.createElement('li')
        itemLi.dataset.id = cartItem.id
        console.log(itemLi)
    }
})
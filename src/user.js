document.addEventListener('DOMContentLoaded', function(e){
    usersCartUrl = "http://localhost:3000/users_carts"
    
    const itemUl = document.querySelector('.item')

    const fetchCartItems = () => {
        fetch(`${usersCartUrl}/3`)
        .then(resp => resp.json())
        .then(cartItems => renderCartItems(cartItems))
    }
    
    const renderCartItems = cartItems => {
        cartItems.forEach(cartItem => {
            renderCartItem(cartItem)
        })
    }

    const renderCartItem = (cartItem) => {
        const itemLi = document.createElement('li')
        itemLi.dataset.id = cartItem.id

        const itemId = `${cartItem.item_id}`
        const itemName = Item.find_by_id(itemId)
        console.log(itemName)
        // const itemPrice = 
        // const itemQuantity = 

        itemLi.innerHTML = `
        name: ${cartItem.item_id}
        quantity:
        price: 
        `
        // console.log(itemLi)
    }


    fetchCartItems()
})
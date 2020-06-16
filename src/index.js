document.addEventListener('DOMContentLoaded', function(e){

// Users Cart
    const usersCartUrl = "http://localhost:3000/users_carts"
    const cartItemUrl = "http://localhost:3000/cart_items"
    const restaurantMenusUrl = "http://localhost:3000/restaurant_menus"
    const itemsUrl = "http://localhost:3000/items"
    const itemOl = document.querySelector('.item')
    let total = 0
    let userCardId = 1

 // Fetching items in usercart from database
    const fetchCartItems = () => {
        fetch(`${usersCartUrl}/${userCardId}`)
        .then(resp => resp.json())
        .then(cartItems => renderCartItems(cartItems))
    };

// Rendering all cart items
    const renderCartItems = cartItems => {
        cartItems.forEach(cartItem => {
            renderCartItem(cartItem)
        })
    };

// Rendering single cart item
    const renderCartItem = (cartItem) => {
        const itemLi = document.createElement('li')
        itemLi.dataset.id = cartItem.id
        itemLi.className = "user"
        const itemId = `${cartItem.item_id}`
        const quantity = `${cartItem.quantity}`

        fetch(`${itemsUrl}/${itemId}`)
        .then(resp => resp.json())
        .then(item => {
            itemLi.innerHTML = `
            ${item.name}            
            <br/>
            Price: $${item.price}
            <br/>
            Quantity: ${quantity}
            <br/>
            <button class="Remove Item">Remove Item</button>
            `
            itemOl.appendChild(itemLi)

            let subtotal = quantity * parseInt(item.price)
            total = total + subtotal 
            const pTotal = document.querySelector('.cart-total')
            pTotal.innerText = `Total: $${total}`
        })

    };

    fetchCartItems()

//End Users Cart



// Fetch restaurant menu from database
    fetch("http://localhost:3000/restaurant_menus")
    .then(r => r.json())
    .then(restaurants => restaurants.forEach(x => createRestaurant(x)))
    
// creating restaurant div
    restaurants = document.getElementById("restaurants")
    function createRestaurant(restaurant) {
        restaurantTag = document.createElement("div")
        restaurantTag.dataset.id = restaurant.id
        restaurantTag.className = "restaurant"
        restaurantTag.innerHTML = ""
        restaurantTag.innerHTML = `
        <h2>${restaurant.name}</h2>
        <h4>${restaurant.cuisine}</h4>
        <p>${restaurant.address}</p>
        <p>${restaurant.phone_number}</p>
        <hr>
        `
        restaurants.append(restaurantTag)
    }
    restaurantMenu = document.getElementById("restaurantMenu")
    
// showing menu
    function showMenu(menu){
        restaurantMenu.innerHTML = ""
        menu.forEach(createItem)
    }
    
// showing items in menu
    function createItem(item){
        itemDiv = document.createElement("div")
        itemDiv.dataset.id = item.id
        itemDiv.innerHTML = `
        <p><strong>${item.name}</strong> <em>$${item.price}</em></p>
        <p>${item.description}</p>
        <button class="addToCart">Add to Cart</button>
        <hr>
        `
        restaurantMenu.append(itemDiv)
    }
    
//click eventlistener
    document.addEventListener("click", function(e) {
        if (e.target.className === "restaurant"){
            let restaurantId = e.target.dataset.id
            fetch(`http://localhost:3000/restaurant_menus/${restaurantId}`).then(r => r.json()).then(showMenu)
        } else if (e.target.className === "addToCart") {
            let itemId = e.target.parentNode.dataset.id
            fetch(`http://localhost:3000/cart_items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({item_id: itemId, quantity: 1, users_cart_id: userCardId})
            }).then(r => r.json()).then(renderCartItem)
        } else if (e.target.className === "Remove Item"){
            let cartItemId = e.target.parentNode.dataset.id
            console.log(cartItemId)
            fetch(`http://localhost:3000/cart_items/${cartItemId}`, {
                method: 'DELETE'

            }).then(e.target.parentNode.remove())
        } else if (e.target.className === "checkout") {
            cartList = document.getElementsByClassName("item")[0]
            total = 0
            cartList.remove()
        }
    })
        
// end of restaurant menu/item code

})
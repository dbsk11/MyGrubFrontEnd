document.addEventListener('DOMContentLoaded', function(e){
// constants
    const usersCartUrl = "http://localhost:3000/users_carts"
    const cartItemUrl = "http://localhost:3000/cart_items"
    const restaurantMenusUrl = "http://localhost:3000/restaurant_menus"
    const itemsUrl = "http://localhost:3000/items"
    const itemOl = document.querySelector('.item')
    let total = 0
    let userCardId = 1

 // UserCart - fetching usercart data
    const fetchCartItems = () => {
        fetch(`${usersCartUrl}/${userCardId}`)
        .then(resp => resp.json())
        .then(cartItems => renderCartItems(cartItems))
    };

// UserCart - render all cart items
    const renderCartItems = cartItems => {
        cartItems.forEach(cartItem => {
            renderCartItem(cartItem)
        })
    };

// UserCart - render individual cart item
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
            <h4>${item.name}</h4>
            <p class="price">Price: $ ${item.price}</p>
            <p>Quantity: ${quantity}</p>
            <button class="Remove Item">Remove Item</button>
            `
            itemOl.appendChild(itemLi)

            let subtotal = quantity * parseInt(item.price)
            total = total + subtotal 
            const pTotal = document.querySelector('.cart-total')
            pTotal.innerText = `Total: $ ${total}`
        })

    };

// RestaurantMenu - fetch restaurant data
    fetch(restaurantMenusUrl)
    .then(r => r.json())
    .then(restaurants => restaurants.forEach(x => createRestaurant(x)));
    
// RestaurantMenu - creating restaurant div and restaurant info
    const restaurants = document.getElementById("restaurants")
    function createRestaurant(restaurant) {
        const restaurantTag = document.createElement("div")
        restaurantTag.dataset.id = restaurant.id
        restaurantTag.className = "restaurant"
        restaurantTag.innerHTML = ""
        restaurantTag.innerHTML = `
        <h3>${restaurant.name}</h3>
        <h4>${restaurant.cuisine}</h4>
        <p>${restaurant.address}</p>
        <p>${restaurant.phone_number}</p>
        <hr>
        `
        restaurants.append(restaurantTag)
    };
    
// Items - rendering restaurant menu
    restaurantMenu = document.getElementById("restaurantItems")

    function showMenu(menu){
        restaurantMenu.innerHTML = ""
        menu.forEach(createItem)
    };
    
// Items - rendering individual items on restaurant menu
    function createItem(item){
        const itemDiv = document.createElement("div")
        itemDiv.dataset.id = item.id
        itemDiv.innerHTML = `
        <h4>${item.name} $${item.price}</h4>
        <p>${item.description}</p>
        <button class="addToCart">Add to Cart</button>
        <hr>
        `
        restaurantMenu.append(itemDiv)
    };
    
//click eventlisteners
    document.addEventListener("click", function(e) {
        if (e.target.className === "restaurant"){
            const restaurantId = e.target.dataset.id
            fetch(`${restaurantMenusUrl}/${restaurantId}`).then(r => r.json()).then(showMenu)
        } else if(e.target.className === "addToCart"){
            const itemId = e.target.parentNode.dataset.id
            fetch(cartItemUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({item_id: itemId, quantity: 1, users_cart_id: userCardId})
            }).then(r => r.json()).then(renderCartItem)
        } else if(e.target.className === "Remove Item"){
            const cartItemId = e.target.parentNode.dataset.id
            const parentNode = e.target.parentNode

            const priceTag = parentNode.querySelector('.price')
            const price = parseInt(priceTag.innerText.split(" ")[2])
            const pTotal = document.querySelector('.cart-total')
            const subtotal = parseInt(pTotal.innerText.split(" ")[2])
            let newTotal = subtotal - price
            pTotal.innerText = `Total: $ ${newTotal}`       
        
            fetch(`${cartItemUrl}/${cartItemId}`, {
                method: "DELETE"
            })
            .then(e.target.parentNode.remove())
        } else if(e.target.className === "checkout"){
            cartList = document.getElementsByClassName("item")[0]
            
            fetch(`${cartItemUrl}`, {
                method: "DELETE"
            })
            cartList.remove()

            const pTotal = document.querySelector('.cart-total')
            pTotal.innerText = `Total: $ 0`       
        }
    });

    fetchCartItems();

});
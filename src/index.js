document.addEventListener('DOMContentLoaded', function(e){
// constants
    const usersCartUrl = "http://localhost:3000/users_carts"
    const cartItemUrl = "http://localhost:3000/cart_items"
    const restaurantMenusUrl = "http://localhost:3000/restaurant_menus"
    const itemsUrl = "http://localhost:3000/items"
    const itemOl = document.querySelector('.item')
    const restaurants = document.getElementById("restaurants")
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
            <h4 class="item">${item.name} - <em>$ ${item.price}</em></h4>
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
    fetch(restaurantMenusUrl).then(r => r.json()).then(restaurants => restaurants.forEach(x => createRestaurant(x)));

    let restaurantList = []
    let menuList = []

//Restaurants - rendering restaurants
    function createRestaurant(restaurant) {
        restaurantList.push(restaurant)
        const restaurantTag = document.createElement("div")
        restaurantTag.dataset.id = restaurant.id
        restaurantTag.innerHTML = ""
        restaurantTag.innerHTML = `
        <h3 class="restaurant">${restaurant.name}</h3>
        <hr>
        `
        restaurants.append(restaurantTag)
    };

// Items - rendering restaurant menu
    restaurantMenu = document.getElementById("restaurantItems")
    restaurantInfo = document.getElementById("restaurantInfo")
    function showMenu(menu){
        restaurantMenu.innerHTML = ""
        menu.forEach(createItem)
    };

// Items - rendering individual items on restaurant menu
    function createItem(item){
        const itemDiv = document.createElement("div")
        itemDiv.dataset.id = item.id
        itemDiv.innerHTML = `
        <h4>${item.name} - <em>$${item.price}</em></h4>
        <p>${item.description}</p>
        <button class="addToCart">Add to Cart</button>
        <hr>
        `
        restaurantMenu.append(itemDiv)
    };

//Restaurant - adding info to menu panel
    function addRestaurantInfo(id){
        infoDiv = document.querySelector("#restaurantInfo")
        restroDesc = restaurantList[id - 1]
        infoDiv.innerHTML = ""
        infoDiv.innerHTML = `
        <h3>${restroDesc.name} - <em>${restroDesc.phone_number}</em></h3>
        `
    }

//click eventlisteners
    document.addEventListener("click", function(e) {
        if (e.target.className === "restaurant"){
            restaurantId = e.target.parentNode.dataset.id
            addRestaurantInfo(restaurantId)
            menuList = []
            fetch(`${restaurantMenusUrl}/${restaurantId}`).then(r => r.json()).then(menu => menu.forEach(item => menuList.push(item)))
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

            const itemTag = parentNode.querySelector('.item')
            const itemTagArray = itemTag.innerText.split(" ")
            const priceIndex = itemTagArray.length - 1
            const price = itemTagArray[priceIndex]
            const pTotal = document.querySelector('.cart-total')
            const subtotal = parseInt(pTotal.innerText.split(" ")[2])
            let newTotal = subtotal - price
            pTotal.innerText = `Total: $ ${newTotal}`       

            fetch(`${cartItemUrl}/${cartItemId}`, {
                method: "DELETE"
            })
            .then(e.target.parentNode.remove())
        } else if(e.target.className === "checkout"){
            let cartList = document.querySelectorAll(".user")
            fetch(`${usersCartUrl}/${userCardId}`).then(r => r.json()).then(data => data.forEach(
                cartData => fetch(`${cartItemUrl}/${cartData.id}`, {
                    method: "DELETE"
                })
            ))
            cartList.forEach(item => item.remove())
            total = 0
            const pTotal = document.querySelector('.cart-total')
            pTotal.innerText = `Total: $ 0`    
            alert("Your order has been placed!")   
        }
    });

    const cuisineFilter = document.querySelector('.cuisine')
    cuisineFilter.addEventListener("change", function(e){
        if (e.target.value == "American"){
            restaurants.innerHTML=""
            fetch(restaurantMenusUrl).then(r => r.json()).then(data => data.filter(restro => restro.cuisine === "American")).then(restaurants => restaurants.forEach(x => createRestaurant(x)));
        } else if (e.target.value === "Thai"){
            restaurants.innerHTML=""
            fetch(restaurantMenusUrl).then(r => r.json()).then(data => data.filter(restro => restro.cuisine === "Thai")).then(restaurants => restaurants.forEach(x => createRestaurant(x)));
        } else if (e.target.value === "Italian"){
            restaurants.innerHTML=""
            fetch(restaurantMenusUrl).then(r => r.json()).then(data => data.filter(restro => restro.cuisine === "Italian")).then(restaurants => restaurants.forEach(x => createRestaurant(x)));
        } else if (e.target.value === "All"){
            restaurants.innerHTML=""
            fetch(restaurantMenusUrl).then(r => r.json()).then(restaurants => restaurants.forEach(x => createRestaurant(x)));
        }
    })

    const categoryFilter = document.querySelector('.category')
    categoryFilter.addEventListener("change", function(e){
        if (e.target.value === "Appetizer") {
            restaurantMenu.innerHTML = ""
            showMenu(menuList.filter(item => item.category === "Appetizer"))
        } else if (e.target.value === "Entree") {
            restaurantMenu.innerHTML = ""
            showMenu(menuList.filter(item => item.category === "Entree"))
        } else if (e.target.value === "Beverages") {
            restaurantMenu.innerHTML = ""
            showMenu(menuList.filter(item => item.category === "Beverages"))
        } else if (e.target.value === "Dessert"){
            restaurantMenu.innerHTML = ""
            showMenu(menuList.filter(item => item.category === "Dessert"))
        } else if (e.target.value === "All") {
            restaurantMenu.innerHTML = ""
            showMenu(menuList)
        }
    })

    fetchCartItems();

});
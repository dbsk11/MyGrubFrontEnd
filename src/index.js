fetch("http://localhost:3000/restaurant_menus").then(r => r.json()).then(restaurants => restaurants.forEach(x => createRestaurant(x)))



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


function showMenu(menu){
    restaurantMenu.innerHTML = ""
    menu.forEach(createItem)
}


function createItem(item){
    itemDiv = document.createElement("div")
    itemDiv.dataset.id = item.id
    itemDiv.innerHTML = `
    <p><strong>${item.name}</strong> <em>${item.price}</em></p>
    <p>${item.description}</p>
    <button class="addToCart">Add to Cart</button>
    <hr>
    `
    restaurantMenu.append(itemDiv)

}

document.addEventListener("click", function(e) {
    if (e.target.className == "restaurant"){
        restaurantId = e.target.dataset.id
        console.log("clicked")
        fetch(`http://localhost:3000/restaurant_menus/${restaurantId}`).then(r => r.json()).then(showMenu)
    }
})

fetch("http://localhost:3000/restaurant_menus").then(r => r.json()).then(restaurants => restaurants.forEach(x => createRestaurant(x)))


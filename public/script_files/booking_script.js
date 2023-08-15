var recordForDb = []
var dataIndex =0;
if(document.readyState == "loading"){
document.addEventListener("DOMContentLoaded", ready)
} else {
    ready();
}
function ready(){

    var removeCartItemButtons = document.getElementsByClassName("btn-danger");
    //console.log(removeCartItemButtons)
    for (var i = 0; i < removeCartItemButtons.length; i++){
        var button = removeCartItemButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    
    var addToCartButtons = document.getElementsByClassName("add-event-button");
    for(var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i];
        button.addEventListener("click", addToCartClicked);
    }
    // Get a reference to the events dropdown
    const selectEvent = document.getElementById('event_id');
    // Add an event listener to the events dropdown
    selectEvent.addEventListener("change", getAvailableBooths);

    // Event listener for cart submission
    const submitCartButton = document.getElementById('submitCart');
    submitCartButton.addEventListener('click', () => {
      submitCart();
    });

       
}

 function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClickedParent = buttonClicked.parentElement
    buttonClickedParent.remove();
    const indexToRemove = parseInt(this.getAttribute('data-index'), 10)
    
    recordForDb.splice(indexToRemove, 1);
    updateCartTotal();
    
    
        dataIndex = indexToRemove - 1;
    
    console.log(recordForDb);
    console.log("data index to remove: ",indexToRemove);
    console.log("data index: ", dataIndex)
   
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    for(var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName ("cart-price")[0];
        var price = parseFloat(priceElement.innerText.replace("R",""));
        //console.log(price);
        total = parseFloat(total + price);
    }
    total = Math.round(total * 100)/100
    document.getElementsByClassName("cart-total-price")[0].innerText = "R " + total;
}

function addToCartClicked(event){
    var button = event.target;
    //var cartEvent = button.parentElement.parentElement;
    addItemsToCart();
    //console.log(cartEvent);
}
function addItemsToCart(){
    var userNameID = document.getElementById("name");
    var userSurnameID = document.getElementById("surname");
    var emailID = document.getElementById("email");
    var contactNumberID = document.getElementById("contactNumber");
    var eventID = document.getElementById("event_id");
    var boothID = document.getElementById("booth_id");
    var alcoholID = document.getElementById("alcohol_id");
    var foodID = document.getElementById("food_id");
    var userName = userNameID.value;
    var userSurname = userSurnameID.value;
    var email = emailID.value
    var contactNumber = contactNumberID.value;
    //console.log(userName, userSurname, email, contactNumber);
    var eventIDValue = eventID.value;
    var boothIDValue = boothID.value;
    var alcoholIDValue = alcoholID.value;
    var foodIDValue = foodID.value;
    

    if(eventIDValue !== "" & boothIDValue !== "" & alcoholIDValue !== ""
     & userName !== "" & userSurname !== "" & email !== "" & contactNumber !== ""){
        var eventSelected = eventID.options[eventID.selectedIndex].text;
        var boothSelected = boothID.options[boothID.selectedIndex].text;
        var alcoholSelected = alcoholID.options[alcoholID.selectedIndex].text;
        var foodSelected = foodID.options[foodID.selectedIndex].text;

        //Alcohol Price
        var alcoholPriceDelimit = alcoholSelected.indexOf("-");
        var alcoholPriceString = alcoholSelected.substring(alcoholPriceDelimit + 1);
        var alcoholPrice = parseFloat(alcoholPriceString);
        
        //Food price
        if(foodIDValue!==""){
            var foodPriceDelimit = foodSelected.indexOf("-");
            var foodPriceString = foodSelected.substring(foodPriceDelimit + 1);
            var foodPrice = parseFloat(foodPriceString);
        } else{
            foodPrice = 0;
        }

        //console.log(eventSelected, boothSelected, alcoholSelected, foodSelected, "Alcohol Price:", alcoholPrice, "Food Prince:", foodPrice);
        eventID.selectedIndex = 0;
        boothID.selectedIndex = 0;
        alcoholID.selectedIndex = 0;
        foodID.selectedIndex = 0;
        createCartEntry(eventSelected, boothSelected, alcoholSelected, foodSelected, alcoholPrice, foodPrice);
        updateCartTotal();
        recordForDb.push({userName, userSurname, email, contactNumber, eventIDValue, boothIDValue, alcoholIDValue, foodIDValue});
    
    } else{
        alert("Please ensure that all the required fields are entered.");
    }

    console.log(recordForDb);

}

function submitCart(){

    let body = JSON.stringify({recordForDb});
   fetch("/submit_booking",
   {method:"post", 
    body:body,
    headers: {
      'Content-Type': 'application/json'
    }});
    
}

function createCartEntry(eventSelected, boothSelected, alcoholSelected, foodSelected, alcoholPrice, foodPrice){
   
    var cartEntry = document.createElement("div");
    cartEntry.classList.add("cart-row");
    var cartItems = document.getElementsByClassName("cart-items")[0];
    //console.log(cartItems);
    if(foodSelected !== "Please select your food choice"){
    var totalPrice = alcoholPrice + foodPrice
    var cartEntryContents = `
    <hr class="cart-separator">
    <div class="cart-event cart-column">${eventSelected}</div>
    <div class="cart-booking-type cart-column">${boothSelected}</div>
    <div class="cart-alcohol cart-column">${alcoholSelected}</div>
    <div class="cart-food cart-column">${foodSelected}</div>
    <span class="cart-price cart-column">R ${totalPrice}</span>
    <button class="btn btn-danger remove-button" data-index="${dataIndex}" type="button">REMOVE</button>
    `
    cartEntry.innerHTML = cartEntryContents;
    cartItems.append(cartEntry);
    cartEntry.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem);
    }
    else{
        var totalPrice = alcoholPrice + foodPrice
        var cartEntryContents = `
        <div class="cart-event cart-column">${eventSelected}</div>
        <div class="cart-booking-type cart-column">${boothSelected}</div>
        <div class="cart-alcohol cart-column">${alcoholSelected}</div>
        <div class="cart-food cart-column">No Food Selected</div>
        <span class="cart-price cart-column">R ${totalPrice}</span>
        <button class="btn btn-danger remove-button" data-index="${dataIndex}" type="button">REMOVE</button>
        `
        cartEntry.innerHTML = cartEntryContents;
        cartItems.append(cartEntry);
        cartEntry.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem); 
    }
    dataIndex ++;
    console.log("Data Index after added item: ", dataIndex);
     
}

function getAvailableBooths(){
    var selectedEventId = event.target.value; // Get the selected event ID
   // console.log(selectedEventId);

// Make an AJAX request to the server to fetch the available booths for the selected event
    fetch(`/getAvailableBooths?eventId=${selectedEventId}`)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
    //console.log(data);
    // Get a reference to the booths dropdown
    const selectBooth = document.getElementById('booth_id');

    // Clear existing options in the booths dropdown
    selectBooth.innerHTML = '';

    // Add the available booths as options to the booths dropdown
    data.availableBooths.forEach(booth => {
      const option = document.createElement('option');
      option.value = booth.booth_id;
      option.text = `${booth.type} - ${booth.seating} Seater`;
      selectBooth.appendChild(option);
    });
    })
        .catch(error => {
        console.error('Error fetching available booths:', error);
    });
}


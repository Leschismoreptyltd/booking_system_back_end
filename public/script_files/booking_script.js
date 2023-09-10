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
    submitCartButton.addEventListener("click", submitCart);
    
    //Slideshow prep and initiate
    fetchData();

    window.addEventListener("load", getEventId)

    
       
}

function getEventId(){
    const eventId = getQueryParams("event_id");
    console.log("Event ID: ", eventId);
    const eventSelect = document.getElementById("event_id");
    if (eventId === null){

        eventSelect.text = "";

    } else{
        
        eventSelect.value = eventId;
    }
    getAvailableBooths()
    
}

function getQueryParams(name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

 function removeCartItem(event){
    var removeIndex
    var buttonClicked = event.target;
    buttonClickedParent = buttonClicked.parentElement
    buttonClickedParent.remove();
    //const indexToRemove = parseInt(this.getAttribute('data-index'), 10)
    console.log(buttonClicked);
    console.log(buttonClickedParent);
    const eventID = buttonClickedParent.querySelector(".cart-event-id").value;
    const boothID = buttonClickedParent.querySelector(".cart-booking-type-id").value;
    const alcoholID = buttonClickedParent.querySelector(".cart-alcohol-id").value;
    // Use the dynamicIndex to remove the corresponding item from the array
    console.log("Values from hiddent input: ", eventID, boothID, alcoholID)
    const indexToRemove = recordForDb.findIndex(item =>(
        item.eventIDValue === eventID &&
        item.boothIDValue === boothID &&
        item.alcoholIDValue === alcoholID
    ));

    console.log(indexToRemove);
    recordForDb.splice(indexToRemove, 1);
    updateCartTotal();
    
    
        dataIndex = recordForDb.length -1;
    
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
    var boothIDValue = boothID.value;
    var alcoholIDValue = alcoholID.value;
    var foodIDValue = foodID.value;
    var eventIDValue = eventID.value
    

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
        createCartEntry(eventSelected, boothSelected, alcoholSelected, foodSelected, alcoholPrice, foodPrice, eventIDValue, boothIDValue, alcoholIDValue);
        updateCartTotal();
        recordForDb.push({userName, userSurname, email, contactNumber, eventIDValue, boothIDValue, alcoholIDValue, foodIDValue});
    
    } else{
        alert("Please ensure that all the required fields are entered.");
    }

    console.log(recordForDb);
    clearForm();
}

async function submitCart(){

    let body = JSON.stringify({recordForDb});
    //console.log("Body: ", body);
   await fetch("/submit_booking",
   {method:"post", 
    body:body,
    headers: {
      'Content-Type': 'application/json'
    }});
    alert("Thank you for placing a booking. For more informtaion please contact Cellars at 078 555 2525.")
    clearCart()
    updateCartTotal()
    clearForm();    
}

/*function completePurchase(){
    submitCart
    clearCart
}*/
function clearCart() {

    var cartItems = document.getElementsByClassName("cart-items")[0];
    console.log(cartItems);
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
}
function clearForm(){
    document.getElementById("booking-form").reset(); 
}

function createCartEntry(eventSelected, boothSelected, alcoholSelected, foodSelected, alcoholPrice, foodPrice, eventIDValue, boothIDValue, alcoholIDValue){
    var cartEntry = document.createElement("div");
    cartEntry.classList.add("cart-row");
    var cartItems = document.getElementsByClassName("cart-items")[0];
    //console.log(cartItems);
    if(foodSelected !== "Please select your food choice"){
    var totalPrice = alcoholPrice + foodPrice
    var cartEntryContents = `
    <div class="cart-event cart-column">${eventSelected}</div>
    <div class="cart-booking-type cart-column">${boothSelected}</div>
    <div class="cart-alcohol cart-column">${alcoholSelected}</div>
    <div class="cart-food cart-column">${foodSelected}</div>
    <span class="cart-price cart-column">R ${totalPrice}</span>
    <button class="btn btn-danger remove-button" data-index="${dataIndex}" type="button">REMOVE</button>
    <input type="hidden" class="cart-event-id" value="${eventIDValue}">
    <input type="hidden" class="cart-booking-type-id" value="${boothIDValue}">
    <input type="hidden" class="cart-alcohol-id" value="${alcoholIDValue}">
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
        <input type="hidden" class="cart-event-id" value="${eventIDValue}">
        <input type="hidden" class="cart-booking-type-id" value="${boothIDValue}">
        <input type="hidden" class="cart-alcohol-id" value="${alcoholIDValue}">
        `
        cartEntry.innerHTML = cartEntryContents;
        cartItems.append(cartEntry);
        cartEntry.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem); 
    }
    dataIndex ++;
    console.log("Data Index after added item: ", dataIndex, "event_id: ", eventIDValue, "booth_id: ", boothIDValue, "alcohol_id: ", alcoholIDValue);
     
}

function getAvailableBooths(){
    //var selectedEventId = event.target.value; // Get the selected event ID
    const selectEventId = document.getElementById('event_id')

    console.log("Event ID: ", selectEventId);
    var EventId = selectEventId.value;
    console.log("Event ID from Option element: ", EventId)

// Make an AJAX request to the server to fetch the available booths for the selected event
    fetch(`/getAvailableBooths?eventId=${EventId}`)
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

async function fetchData(){
    console.log("fetching data")
    fetch('/get_images')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Data: ", data);
        populateSlideshow(data)
    })
    
}

function populateSlideshow(images) {
    const slideshowContainer = document.getElementById("slide-images");
    //console.log("Slideshow container: ",slideshowContainer);
    fileNames = images[0];
    //console.log("file names: ",fileNames)
    for(i = 0; i < fileNames.length; i++){
        //console.log(i);
        //console.log(fileNames[i].file_path);
        const slideshowGroup = document.createElement("div");
        slideshowGroup.className = "img-container";

        const img = document.createElement("img");
        img.src = `/uploads/${fileNames[i].file_path}`;
        img.alt = "Advertising Image";
        img.className = "slide";
        
        slideshowGroup.append(img);
       // console.log("Slideshow Group", slideshowGroup)
        slideshowContainer.append(slideshowGroup);
        slideAnimation()
    }

function slideAnimation(){

    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(slideIndex) {
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    // Show the specified slide
    slides[slideIndex].style.display = 'block';
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
          currentSlide = 0;
        }
        showSlide(currentSlide);
     }

  function previousSlide() {
    currentSlide--;
    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
  }

  // Show the initial slide
  showSlide(currentSlide);

  // Change slide every 3 seconds (adjust the timing as needed)
  setInterval(nextSlide, 3000);
}
  
}


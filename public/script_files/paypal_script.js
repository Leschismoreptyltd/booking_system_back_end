const paypal = document.getElementById("paypal")
const amount = document.getElementById("amount")
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    
    function ready(){

        console.log("PayPal component: ",paypal, "\'nAmount component: ", amount)

    }

function placeOrder(){
    
}
paypal.Buttons({

    createOrder
})
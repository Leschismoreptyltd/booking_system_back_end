addEvents=[];
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    function ready(){

        document.getElementById("events-carousel-container").addEventListener("load", loadEventPosters);
    }

    function loadEventPosters(){
        console.log("The page has been loaded");
    }
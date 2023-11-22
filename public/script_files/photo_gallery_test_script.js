var newIndex = 0;
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    function ready(){

        const buttonNext = document.getElementById("nextSlide");
        buttonNext.addEventListener("click", changeSlide);

        const buttonPrevious = document.getElementById("previousSlide");
        buttonPrevious.addEventListener("click", changeSlide);
           
    }



function changeSlide(e){
    //e.preventDefault();
    console.log("Its working")
    const buttonClicked = e.target
    console.log(buttonClicked)
    const offset = buttonClicked.dataset.carouselButton === "next" ? 1:-1;
    console.log("Offset: ",offset)
    const slides = buttonClicked.closest("[data-carousel]").querySelector("[data-slides]");
    console.log("Slides query selector: ", slides)
    const activeSlide = slides.querySelector("[data-active]");
    console.log("Active Slide: ", activeSlide);
    newIndex = [...slides.children].indexOf(activeSlide) + offset
    console.log("New Index before click: ", newIndex)
    console.log("Children: ", [...slides.children])

    if(newIndex < 0) {newIndex = slides.children.length - 1;
        console.log("If less than 0:", newIndex)
    }
    if(newIndex >= slides.children.length) {newIndex = 0;
        console.log("If >= slides.length: ", newIndex)
    }
    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active
    console.log("New Index after click: ", newIndex);    

}

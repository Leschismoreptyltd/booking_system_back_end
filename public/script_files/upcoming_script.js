addEvents=[];
let posterPath; 
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    function ready(){

        window.addEventListener("load", fetchPosterData);

        const buttonNext = document.getElementById("nextSlide");
        buttonNext.addEventListener("click", changeSlide);

        const buttonPrevious = document.getElementById("previousSlide");
        buttonPrevious.addEventListener("click", changeSlide);

    }

    function loadEventPosters(eventPosterFileName){

        console.log("The page has been loaded");
        
        posterFileName = eventPosterFileName[0];
        console.log("Poster path:", posterFileName);
        
            posterCarousel = document.getElementById("events-carousel-container")
            console.log(posterCarousel);
        
        posterFileName.forEach(posterName => {
            //console.log(posterName.poster_path)
            filePath = posterName.poster_path;
            eventName = posterName.event_name;
            eventDescription = posterName.description;
            eventId = posterName.event_id;
            var eventCard = document.createElement("div");
            eventCard.classList.add("event-card");

            var eventCardContents = `
            <div class="event-poster">
            <img src="/uploads/${filePath}" alt="">
                <div class="event-details">
                    <h2>${eventName}</h2>
                    <h3>${eventDescription}</h3>
                </div>
                <a href="/make-bookings?event_id=${eventId}">
                <button class="btn book-now" id="book-now">Book Now</button>
                </a>
            </div>
            `
            eventCard.innerHTML = eventCardContents;
            posterCarousel.append(eventCard);
            
        });
               
    }

    async function fetchPosterData(){
        console.log("fetching data")
        fetch('/get_posters')
          .then(response => response.json())
          .then(data => {
            //console.log("Fetched Data: ", data);
            loadEventPosters(data)
        })
        
    }

    function changeSlide(e){
        //e.preventDefault();
        console.log("Its working")
        const buttonClicked = event.target
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
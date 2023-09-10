addEvents=[];
let posterPath; 
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    function ready(){

        window.addEventListener("load", fetchPosterData);

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
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {

        ready();

    }

    function ready(){

        window.addEventListener("load", fetchPhotos);

        const albumCoverClicksTemp = document.getElementsByClassName("cover-photo")
        const albumCoverClicks = [...albumCoverClicksTemp];
        console.log("Album Cover Click: ",albumCoverClicksTemp);
        console.log("Album Cover Clicks Length: ", albumCoverClicks)
        for (var i = 0; i < albumCoverClicks.length; i++){
            var albumCoverClick = albumCoverClicks[i].textContent;
            albumCoverClick.addEventListener("click", loadPhotoCarousel)

        }

    
    }

    function loadPhotoAlbum(albumData){
        
        console.log("Photo Album Loaded");
        //console.log(albumData)
        albumCovers=albumData[0];
        albumContent = albumData[1];
        //console.log(albumCovers);
        //console.log(albumContent);

        var galleryWeek = document.getElementById("gallery-week");
        //console.log(galleryWeek);

        albumCovers.forEach(albumCover =>{
            eventID = albumCover["event_id"];
            eventDateTemp = albumCover["event_date"];
            eventAlbumCover = albumCover["image_file_name"];
            eventName = albumCover["event_name"];
            eventDate = eventDateTemp.match(/^\d{4}-\d{2}-\d{2}/)[0]

            console.log("Event ID: ", eventID, "\nEvent Name: ", eventName, "\nEvent Date: ", eventDate,
            "\nEvent Album Cover: ", eventAlbumCover);

            var eventContainer = document.createElement("div")
            eventContainer.classList.add("event-container")

            var eventContent = `
            <div class="inner-title-block">
            <h2>${eventName}</h2>
            <h3>${eventDate}</h3>
        </div>
        <div class="event-card">

            <div class="cover-photo">
                <a class="eventName" href="#"><img src="/uploads/${eventAlbumCover}" alt="" id="eventName1"></a>
            </div>
            <div class="gallery">

            </div>
        </div>
            `

            eventContainer.innerHTML = eventContent
            galleryWeek.append(eventContainer)
            //console.log(eventContainer)


        })   

    }

    async function fetchPhotos(){
        console.log("Fetching Data");

        fetch('/getPhotoAlbum')
          .then(response => response.json())
          .then(data => {
            console.log("Fetched Data: ", data);
            loadPhotoAlbum(data)
        
        })
    }

    function loadPhotoCarousel(){
        console.log("CLICKED")
    }

    

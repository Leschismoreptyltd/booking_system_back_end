
        var display = 1;
        var photoIndex = 0;
        var albumContent = [];
        var albumCovers = [];
        var imagePath = [];
        var filteredAlbumPhotos =[];

if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {

        ready();

    }

    function ready(){

        window.addEventListener("load", fetchPhotos);

        const buttonNext = document.getElementById("nextSlide");
        buttonNext.addEventListener("click",  nextSlide);
        console.log("buttonNext: ", buttonNext)

        const buttonPrevious = document.getElementById("previousSlide");
        buttonPrevious.addEventListener("click", previousSlide);
        console.log("buttonPrevious: ", buttonPrevious)

        //Slideshow prep and initiate
        fetchSlideShowData();
        
    
    }

    function loadPhotoAlbum(albumData){
        
        console.log("Photo Album Loaded");
        albumCovers = albumData[0];
        albumContent = albumData[1];
       
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
                <a class="eventClick" onclick= "photoCarousel(this.id)" id="${eventID}"><img src="/uploads/${eventAlbumCover}" alt="" ></a>
            </div>
        </div>
            `

            eventContainer.innerHTML = eventContent
            galleryWeek.append(eventContainer)
            //console.log(eventContainer)
            /*const albumCoverDivs = document.getElementsByClassName("eventClick")
            console.log("Album Cover Anchors: ",albumCoverDivs);

            for (var i = 0; i < albumCoverDivs.length; i++){
                console.log("Individual Anchors: ", albumCoverDivs[i])
        
            }*/

        })   

    }

    function photoCarousel(clickedId){
        console.log("Clicked ID: ", clickedId)
        
        fetch('/getPhotoAlbum')
          .then(response => response.json())
          .then(data => {
            console.log("Fetched Data: ", data);
            buildAlbum(data, clickedId)

        })
        function buildAlbum(albumData, clickedId){
            allAlbumContents = albumData[1];
            console.log("Album Content:", allAlbumContents)
            eventIdTemp = clickedId
            eventId = Number(eventIdTemp)
            console.log(eventId)

            //get image file names for photo carousel
            for( i = 0; i < allAlbumContents.length; i++ ){
                if (eventId === allAlbumContents[i].event_id){
                    //place logic for photo album viewer here =>
                    console.log(allAlbumContents[i].image_file_name)
                    filteredAlbumPhotos = [...filteredAlbumPhotos, allAlbumContents[i]]                   
                }
            }
            
            loadPhotoCarousel(filteredAlbumPhotos)
           
            //console.log("Filtered Album Contents: ",filteredAlbumContents)
           

        }


        
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

    function loadPhotoCarousel(filteredAlbumPhotos){
     

            for(i = 0; i < filteredAlbumPhotos.length; i++){
                imagePath = filteredAlbumPhotos[i].image_file_name
                k=filteredAlbumPhotos.length
                console.log(i, " of ", k, " = ", imagePath)                

            }
    
        //Set up The photo display window
        var divShow = document.getElementById("photoAlbumContainer")
        divShow.style.position = "box" 
        divShow.style.display = "flex"
        divShow.style.height = "100vw"
        divShow.style.background = "rgba(0,0,0,0.9)"

        var imageSource = document.getElementById("individualPhoto")
        imageSourceString= "/uploads/" + filteredAlbumPhotos[photoIndex].image_file_name
        imageSource.src = imageSourceString

        
        albumPhotos = filteredAlbumPhotos
        console.log("images to be displayed: ", albumPhotos)
        

    }
    function closeWindow(){
        var divShow = document.getElementById("photoAlbumContainer")
        divShow.style.display="none";
        filteredAlbumPhotos=[];
    }

    function nextSlide(){
        if (photoIndex < filteredAlbumPhotos.length-1){
            photoIndex ++;
        }else{
            photoIndex = 0
        }
        console.log("Photo Index: ", photoIndex)

        var imageSource = document.getElementById("individualPhoto")
        imageSourceString= "/uploads/" + filteredAlbumPhotos[photoIndex].image_file_name
        imageSource.src = imageSourceString
        console.log("Image Source String: ", imageSourceString)
        console.log("Photo Index: ", photoIndex)

        const buttonNext = document.getElementById("nextSlide")
        console.log("Global Array - albumContent", albumContent)
        console.log("Global Array - albumCovers", albumCovers) 
        console.log("Button Next:", buttonNext)
        for (i = 0; i < albumContent.length; i++){
            //var imagePath = [...imagePath, albumContent[i].image_file_name]
        }
        //console.log("Global Array - Image File Names: ", imagePath);     
         
    }

    function previousSlide(){

        //Setting up the photo image index by using global variables.
        if(photoIndex === 0){
            photoIndex = filteredAlbumPhotos.length - 1
            
        }else{
            photoIndex --;
            
        }
        var imageSource = document.getElementById("individualPhoto")
        imageSourceString= "/uploads/" + filteredAlbumPhotos[photoIndex].image_file_name
        imageSource.src = imageSourceString
        console.log("Image Source String: ", imageSourceString)
        console.log("Photo Index: ", photoIndex)

        const buttonPrevious = document.getElementById("previousSlide")
        console.log("Global Array - albumContent", albumContent)
        console.log("Global Array - albumCovers", albumCovers) 
        console.log("Button Previous:", buttonPrevious)
        console.log("albumContent Length: ", albumContent.length)
        console.log("filtered Album: ", filteredAlbumPhotos)
        
    
        
        //console.log("Global Array - Image File Names: ", imagePath)
    }

    async function fetchSlideShowData(){
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
            /*const slideshowGroup = document.createElement("div");
            slideshowGroup.className = "img-container";*/

            //const slideShowGroup = document.getElementById("slide-images")
    
            const img = document.createElement("img");
            img.src = `/uploads/${fileNames[i].file_path}`;
            img.alt = "Advertising Image";
            img.className = "slide";
            
            //slideshowGroup.append(img);
           // console.log("Slideshow Group", slideshowGroup)
            slideshowContainer.append(img);
            slideAnimation()
        }
    
    function slideAnimation(){
    
        const slides = document.querySelectorAll('.slide');
        var currentSlide = 0;
    
        function showSlide(slideIndex) {
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = 'none';
        }
    
        // Show the specified slide
        slides[slideIndex].style.display = 'flex';
        }
    
        function nextSlide() {
            currentSlide++;
            if (currentSlide > slides.length - 1) {
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
    

addEvents=[];
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    function ready(){
        //const eventSelect = document.getElementById('event_id');
        //eventSelect.addEventListener("change", getEventDate);

        const buttonPopulateTable = document.getElementById("submitButton");
        buttonPopulateTable.addEventListener("click", fetchBookedEventData)

        /*const showBookingsButton = document.getElementById("showEvents");
        showBookingsButton.addEventListener("click", showBookings);*/

        const uploadEventsButton = document.getElementById("uploadEvent");
        uploadEventsButton.addEventListener("click", uploadEvents)

        const printButton = document.getElementById("printButton");
        if(printButton != null){
          printButton.addEventListener("click", printTable);
        }

        const uploadAdvertisementButton = document.getElementById("submitAdvertisementUpload");
        uploadAdvertisementButton.addEventListener("click", uploadAdvertisement)
        console.log(uploadAdvertisementButton)

        const uploadPhotosButton = document.getElementById("submitPhotoUpload")
        uploadPhotosButton.addEventListener("click", uploadPhotos)
        console.log(uploadPhotosButton);
              
    }
    //start here

    function populateEventsTable(bookedEventData){
      var captionDisplayed = false;
      console.log("Table Populate");
      console.log("Data From Back end: ", bookedEventData);
      //var eventName = eventName;
      //console.log("Event Name: ", Event);
      bookedEventData.forEach(booking => {

        var customerName = booking["Name"];        
        var eventName = booking["Event"];   
        var bookingDate = booking["Booking Date"];     
        var bookingType = booking["Booking type"];
        var pax = booking["Pax"];
        var alcoholPackage = booking["Alcohol Package"];        
        var foodPackage = booking["Food Package"];
        var contactNumber = booking["Contact Number"];
        //Change this to Boolean paid field.
        var paid = booking["Total"];

        console.log("Name: ", customerName);
        console.log("Event: ", eventName);
        console.log("Booking Date: ", bookingDate);
        console.log("Booking Type: ", bookingType);
        console.log("Pax: ", pax);
        console.log("Alcohol Package: ", alcoholPackage);
        console.log("Food Package: ", foodPackage);
        console.log("Contact Number: ",contactNumber);
        console.log("Total: ", paid);

        const tableBody = document.getElementById("tableBody");
        var eventDate = new Date(booking["Booking Date"]);
        const tableElement = document.getElementById("bookingTable");
        console.log("Caption Element added after: ", tableElement);

        if (!captionDisplayed){
          const eventDateCaption = document.createElement("caption");
          eventDateCaption.classList.add("tableCaption");
          const eventNameCaption = document.createElement("caption");
          eventNameCaption.classList.add("tableCaption");

          eventDateCaption.textContent = `Event Date: ${eventDate.toLocaleDateString()}`;
          eventNameCaption.textContent = `Event Name: ${eventName}`;

          document.getElementById("bookingTable").appendChild(eventDateCaption);
          document.getElementById("bookingTable").appendChild(eventNameCaption);
          captionDisplayed = true;
        }

        tableRow = document.createElement("tr")

        const tableContent = `
        
            <td> ${customerName}</td>
            <td>${bookingType} </td>
            <td> ${pax}</td>
            <td> ${alcoholPackage}</td>
            <td>${foodPackage}</td>
            <td>${contactNumber}</td>
            <td>R${paid}</td>
        `

        tableRow.innerHTML = tableContent;
        tableBody.append(tableRow);

      });
    
    }

    async function fetchBookedEventData(event){
      const eventIdButton = event.target
      const eventIdOption = document.getElementById("event_id")
      const selectedOption = eventIdOption.options[eventIdOption.selectedIndex];
      //console.log("Selected Option: ", selectedOption)
      tempEventId = selectedOption.value
      eventId =  parseInt(tempEventId)
      //console.log("Event ID: ", eventId)

      const requestBody = JSON.stringify({ event_id: eventId })
      //console.log("Request Body: ", requestBody)
      //console.log("fetching data")

      await fetch("/events_table",{

        method: "POST",
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify({ event_id: eventId })
      })
        .then(res => res.json())
        .then(data => {
          //console.log("Fetched Data: ", data)
          populateEventsTable(data)
        })
    }
      
  
    async function uploadPhotos(e){
      e.preventDefault();

      var htmlSelector = document.getElementById("photo_upload_event_id");
      console.log("html Selector: ", htmlSelector)
      var stringEventID = htmlSelector.value;
      var eventID = parseInt(stringEventID);
      var eventSelected = htmlSelector.selectedIndex;
      var imageFiles = document.getElementById("photoAlbumFileUpload")
      //eventID.selectedIndex = 0;
      if (eventSelected !=-1){

        const selectedOption = htmlSelector.options[eventSelected].text
        console.log("Event Selected:", selectedOption,"Event ID: ", eventID);
        const dateRegex = /\d{4}-\d{2}-\d{2}/
        const eventDate = selectedOption.match(dateRegex)[0]
        console.log("Date: ", eventDate)
        const selectedEventParts = selectedOption.split(dateRegex)
        const eventName = selectedEventParts[0].trim()
        console.log("Event Name: ", eventName)
      

      const formData = new FormData();
      formData.append("event_name", eventName);
      formData.append("event_id", eventID);
      formData.append("event_date", eventDate);
      
      for(i = 0; i < imageFiles.files.length; i++ ){
        formData.append("files", imageFiles.files[i]);
      }

      console.log(...formData)

      await fetch("/upload-photo-album", {
        method: "POST",
        body: formData,
      })
      .then(res => res.json())
      .then(data => console.log(data));

    }
    }



    async function uploadAdvertisement(e){
      e.preventDefault();
      
      const name = document.getElementById("name");
      const startDate = document.getElementById("advertisingStartDate");
      const endDate = document.getElementById("advertisingEndDate");
      const files = document.getElementById("advertisementImage");

      const formData = new FormData();
      formData.append("name", name.value);
      formData.append("startDate", startDate.value);
      formData.append("endDate", endDate.value);

      for (let i = 0; i < files.files.length; i++){
        formData.append ("files", files.files[i]);
      }
 
      console.log(...formData);
      if(files.files.length>0){
        window.alert("Advert was created successfully!");
        name.value = "";
        startDate.value = "";
        endDate.value = "";
        files.value = null;
      }else{
        window.alert("Advert creation was unsuccessful!");
      }

      await fetch("/upload-advertisement", {
        method: "POST",
        body: formData,
      })
      .then(res => res.json())
      .then(data => console.log(data));
    
    }


    function printTable(event){
      //event.preventDefault();
      window.print();
    }

    async function uploadEvents(event){
    
      //event.preventDefault()
      const eventName = document.getElementById("eventName");
      const eventDate = document.getElementById("eventDate");
      const file = document.getElementById("posterFileUpload")
      const eventDescription = document.getElementById("eventDescription");
      const eventUploadTextInput = document.getElementById("eventName")
      const eventUploadDateInput = document.getElementById("eventDate")
      //const eventUploadFileInput = document.getElementById("posterFileUpload")
      const eventUploadTextField = document.getElementById("eventDescription")
      
      const formData = new FormData()

      formData.append("name", eventName.value);
      formData.append("eventDate", eventDate.value);
      formData.append("eventDescription", eventDescription.value);
      formData.append("file", file.files[0]);
      console.log(...formData);
      
      console.log("Text Input: ",eventUploadTextInput, "Date Input: ", eventUploadDateInput, "File Input: ", file, "Text Field Input: ", eventUploadTextField)
      if(file.files.length>0){
        window.alert("Event was created successfully!");
      }else{
        window.alert("Event creation was unsuccessful!");
      }
      clearInputs(eventUploadTextInput, eventUploadDateInput, file, eventUploadTextField);

      await fetch("/uploadEvent",{
        method: "POST",
        body: formData,
      })
      .then(res => res.json())
      .then(data => console.log(data));

     
    
    }

    function clearInputs(textInput, dateInput, fileInput, textFieldInput){
      console.log("Clear Inputs Data: ",textInput, dateInput, fileInput, textFieldInput )
      textInput.value = "";
      fileInput.value = null;
      dateInput.value = "";
      textFieldInput.value = "";

    }
    


    async function showBookings(event) {
      event.preventDefault();
      console.log("showBookings")
        

      fetch('/bookings')
      .then(response => response.json())
      .then(data => {
            console.log(data);
  // Use the data here
          })
    }
    function getEventDate(){
        var eventChange = event.target;
        console.log("EventChange: ", eventChange);
        const selectedOption = eventChange.options[eventChange.selectedIndex];
        console.log("Selected Option: ", selectedOption)
        eventId = selectedOption.value;
        console.log("Event ID: ", eventId)
        const eventInfo = selectedOption.textContent.split(" ");
        const eventName = eventInfo[0];
        const eventDate = eventInfo[1];
        console.log("Array: ",eventInfo, "Event Name: ", eventName, "Event Date: ", eventDate);
        addEventNameAndDate(eventName, eventDate);
    }
    
    function addEventNameAndDate(eventName, eventDate){
        var tableEntry = document.createElement("div");
        tableEntry.classList.add("tableHead");
        var tableItems = document.getElementsByClassName("addHere")[0];
        var tableContents = `
        <tr >
        <th colspan="7">Event: <%= ${eventName} %></th>
      </tr>
      <tr>
        <th colspan="7">Event Date: <%= ${eventDate} %></th>
      </tr>`

      tableEntry.innerHTML = tableContents;


    }

    function clearForm(){
      document.getElementById("bookingForm-Form").reset(); 
  }
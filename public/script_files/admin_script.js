addEvents=[];
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    function ready(){
        const eventSelect = document.getElementById('event_id');
        eventSelect.addEventListener("change", getEventDate);

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
    async function uploadPhotos(e){
      e.preventDefault();

      var eventID = document.getElementById("event_id");
      //var boothIDValue = boothID.value;
      var eventSelected = eventID.options[eventID.selectedIndex].text;
      //eventID.selectedIndex = 0;

      console.log("eventID: ", eventID, "Event Selected:", eventSelected);
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

      await fetch("/upload-advertisement", {
        method: "POST",
        body: formData,
      })
      .then(res => res.json())
      .then(data => console.log(data));
      //document.getElementById("uploadAdvertisingForm").reset(); 

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
        console.log(eventChange);
        const selectedOption = eventChange.options[eventChange.selectedIndex];
        const eventInfo = selectedOption.textContent.split(' - ');
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
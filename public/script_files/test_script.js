
  // Get a reference to the events dropdown
  const selectEvent = document.getElementById('event_id');

  // Add an event listener to the events dropdown
  selectEvent.addEventListener("change", getAvailableBooths);

    function getAvailableBooths(){
        var selectedEventId = event.target.value; // Get the selected event ID
       // console.log(selectedEventId);

    // Make an AJAX request to the server to fetch the available booths for the selected event
        fetch(`/getAvailableBooths?eventId=${selectedEventId}`)
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
    


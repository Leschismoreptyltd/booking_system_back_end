import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import {getBookings, getBookingInfo, 
    getSpecBooking, createBooking, 
    getEventDetails, getBoothDetails, 
    getTest, getAlcohol, 
    getFood, getAvailableBooths,
    getEventById,
    getBoothById,
    getAlcoholById,
    getFoodById,
    adminUserLogin,
    getBookingInfoByID} from "./db.js"
    import path from'path'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.set("view engine", "ejs");
app.use('/public', express.static('public'));

app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));


app.get("/", (req, res) =>{
res.render("index")
});



app.get("/bookings", async (req, res) => {
    const bookings = await getBookings()
    res.send(bookings)
})

app.get("/make-bookings", async (req, res) => {
    try{
    const events = await getEventDetails();
    const booths = await getBoothDetails();
    const alcohol = await getAlcohol();
    const food = await getFood();
    res.render("booking", { events, booths, alcohol, food });
    //console.log(events, booths, alcohol, food)
    }catch(error){
        console.error("Error rendering booking: ", error);
        res.sendStatus(500)
    }
});


app.get("/make_booking", async (req,res) =>{
    const mkBookings = await populateEventDropBox()
    const events = mkBookings;
    res.render("booking", {events})
})

//app.get("/bookings/:id", async (req, res) =>{
//    const id = req.params.id
//    const booking = await getSpecBooking(id)
//    res.send(booking)
//})

app.get("/booking-detail/:name,:surname", async (req, res) =>{
    
    const name = req.params.name
    const surname = req.params.surname
    const bookingDetail = await getBookingInfo(name, surname)
    res.send(bookingDetail)
})

// Route for handling form submission
app.post('/submit_booking', async (req, res) => {
    // Retrieve form data
    //const { event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email } = req.body;
    
    const bookings = req.body.recordForDb;
    //console.log(bookings);
    Promise.all(
    bookings.map(booking => {
      const name = booking.userName;
      const surname = booking.userSurname;
      const email = booking.email;
      const contactNumber = booking.contactNumber;
      const event_id = booking.eventIDValue;
      const booth_id = booking.boothIDValue;
      const alcohol_id = booking.alcoholIDValue;
      const food_id = booking.foodIDValue;
      console.log("Booking Values:", event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email);
      return createBooking(event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email)
    })
    )
    
    .then(results => {
      console.log('Bookings inserted successfully:', results);
      res.sendStatus(200); // Respond with a success status
    })
    .catch(error => {
      console.error('Error inserting bookings:', error);
      res.status(500).send('Error inserting bookings');
    });
      //const{event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email} = booking;
      
     // await createBooking(booking);
    //await createBooking(event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email)
   
    //const bookingDetail = getBookingInfo(req.body.name, req.body.surname)
    
  });

  app.get('/summary/:name/:surname/:contactNumber/:email/:event_id/:booth_id/:alcohol_id/:food_id', async (req, res) =>{
    const { name, surname, email, contactNumber, event_id, booth_id, alcohol_id, food_id } = req.body;
    const eventDescription = await getEventById(event_id)
    const booth = await getBoothById(booth_id)
    const alcohol = await getAlcoholById(alcohol_id)
    const food = await getFoodById(food_id)
    console.log("Query Data: ", eventDescription, booth, alcohol, food, name, surname, contactNumber, email)
    //res.render("summary",{eventDescription, booth, alcohol, food, name, surname, contactNumber, email})
  });
  

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something she is wrong!!!")
})

// Route to handle AJAX request for available booths
app.get('/getAvailableBooths', async (req, res) => {
    try {
      const eventId = req.query.eventId;
  
      // Call the function from db.js to get the available booths for the specified event
      const availableBooths = await getAvailableBooths(eventId);
  
      // Send the available booths as JSON response
      res.json( {availableBooths} );
    } catch (error) {
      console.error('Error fetching available booths:', error);
      res.status(500).json({ error: 'Error fetching available booths from app' });
    }
  });

  //login route
app.get("/admin_login", async (req,res) =>{
  res.render("admin_login");
});

app.get("/admin", async (req, res) =>{
  try{
    const events = await getEventDetails();
  res.render("admin" ,{events})
  }catch(error){
    console.error("Error rendering booking: ", error);
    res.sendStatus(500)
}

});

app.post("/event_detail", async (req, res) =>{
  const eventID = req.body.event_id;
  //console.log("ID: ", eventID);
  try{
    const bookingDetails = await getSpecBooking(eventID);
    const events = await getEventDetails();
    console.log(bookingDetails);
    res.render("adminpop", { bookings: bookingDetails, events: events });

  }catch(error){
    console.error("Error rendering booking: ", error);
    res.sendStatus(500)
}

});

app.post("/login_admin", async (req, res) =>{

  const { username, password } = req.body;
  //console.log(req.body);
  //console.log("username: ", username, "password: ", password);
  try{ 
    const rows = await adminUserLogin(username, password);
    console.log("results: ", rows);
    
    if(rows.length === 1){

      req.session.loggedIn = true;
      res.redirect("/admin");

    } else{

      res.send("Invalid username or password")

    }
  } catch(error){

    console.error(error);
    res.status(500).send("Error occured");

  }
});

app.get("/booking/:bookingID", async (req, res) =>{
  const booking_id =req.params.bookingID
  const results = await getTest(booking_id);
  res.send(results)

});

app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port 3000")
});

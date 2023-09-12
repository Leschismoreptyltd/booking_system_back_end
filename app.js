import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import multer from "multer";
import nodemailer from "nodemailer";

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
    addEvent,
    addAdvertising,
    getAdvertisingImages,
    getEventImageFileName,
    addPhotos,
    getPassedEventDetails} from "./db.js"
    import path from'path'
    //import {generatePDF} from "./pdf.js";


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
 

const upload = multer({dest: __dirname + "/uploads"});
app.use('/uploads', express.static('uploads'));

//Configure nodemailer with SMTP details
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVER_ADDRESS,
  auth:{
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailTemplate = `
<h1>Booking Confirmation</h1>
  <p>Name: {{ name }}</p>
  <p>Email: {{ email }}</p>
  <p>Event Details: {{ eventDetails }}</p>
  <!-- Add more booking details here -->`;


app.get("/", (req, res) =>{
res.render("index")
});

app.get("/bookings", async (req, res) => {
    const bookings = await getBookings()
    res.send(bookings)
});

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

app.get("/make_bookings/:event_id", async (req,res) =>{
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

app.get("/booking-detail/:name,:surname", async (req, res) =>{
    
    const name = req.params.name
    const surname = req.params.surname
    const bookingDetail = await getBookingInfo(name, surname)
    res.send(bookingDetail)
});

// Route for handling form submission

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
    const pastEvents = await getPassedEventDetails();
  res.render("admin" ,{events, pastEvents})
  }catch(error){
    console.error("Error rendering booking: ", error);
    res.sendStatus(500)
}

});

app.get("/booking/:bookingID", async (req, res) =>{
  const booking_id =req.params.bookingID
  const results = await getTest(booking_id);
  res.send(results)

});

app.get("/bookingsTable", async(req, res, next) =>{
  const pdf = generatePDF(req.body);
  console.log("body: ", req.body);
});

app.get("/photo_gallery", async (req, res) =>{
  
  res.render("photo_gallery");
});

app.get("/upcoming", async (req, res) =>{
  
  res.render("upcoming");
});

app.get("/get_images", async (req, res) =>{
  const results = await getAdvertisingImages();
  console.log("Query results: ", results);

  res.send(results);
});

app.get("/get_posters", async (req, res) =>{
  const results = await getEventImageFileName();
  console.log("Event Results", results[0]);
  res.send(results);
})

app.post("/events_table", async (req, res) =>{
  try{
    //const bodyEventID = req.body;
    const eventID = req.body.event_id;
    //console.log("req.body: ", bodyEventID);
    //const eventID = bodyEventID.event_Id

    console.log("Event ID:", eventID);

    var results = await getSpecBooking(eventID);

    console.log("Query Result:", results[0])

    res.send(results)

  }catch{
    console.error("Error rendering booking: ", error);
    res.sendStatus(500)
  }
})

/*app.post("/event_detail", async (req, res) =>{
  const eventID = req.body.eventId;
  console.log("ID: ", eventID);
  try{
    const bookingDetails = await getSpecBooking(eventID);
    const event_name = req.body.event_name;
    const event_date = req.body.event_date;
    const events = await getEventDetails();
    console.log(bookingDetails);
    console.log("Event Name: ", event_name, "Event Date: ", event_date);
    console.log("Event name and date: ", event_name, event_date)
    res.render("adminpop", { bookings: bookingDetails, events: events, eventName: event_name, eventDate: event_date });

  }catch(error){
    console.error("Error rendering booking: ", error);
    res.sendStatus(500)
}

});*/

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

app.post("/uploadEvent", upload.single("file"), async (req, res) =>{

  const eventDetails = req.body;
  const eventName = eventDetails.name;
  const eventDate = eventDetails.eventDate;
  const eventDescription = eventDetails. eventDescription;
  const fileDetail = req.file;
  const fileName = req.file.filename
  console.log("Detail: ", req.body, "File Name: ", req.file);
  console.log("Event Name: ",eventName ,"Event Date: ",eventDate ,"Event Description: ",eventDescription ,"File Name:",fileName)
  
  addEvent(eventDate, eventName, eventDescription, fileName);
  
});


app.post("/upload-advertisement", upload.array("files", 20), async (req, res) =>{

  const body = req.body;
  const name = body.name;
  const display_start_date = body.startDate;
  const display_end_date = body.endDate;
  const fileNames = req.files.map(file => file.filename);
  console.log(req.body);
  console.log(req.files);
  console.log("Deconstructed body: ", name, display_start_date, display_end_date);
  console.log("Deconstructed files: ", fileNames);
  console.log("Deconstructed body: ", fileNames[1]);

  for (let i = 0; i < fileNames.length; i++){
    addAdvertising(name, fileNames[i], display_start_date, display_end_date);
  }



});

app.post("/upload-photo-album", upload.array("files", 50), async (req, res) =>{

  const body = req.body;
  const fileNames = req.files.map(file =>file.filename);
  const eventName = body.event_name;
  const stringEventID = body.event_id;
  const eventID = parseInt(stringEventID)
  const eventDate = body.event_date;

  console.log("Event Name: ", eventName, "\nEvent ID: ", eventID, "\nEvent Date: ", eventDate)
  console.log("File Names: ", fileNames);

  for (let i = 0; i < fileNames.length; i++){
    addPhotos(eventName, eventID, eventDate, fileNames[i]);
  }

});

app.post("/sendEmail", async (req, res) => {


})

app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port 3000")
});

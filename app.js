import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import multer from "multer";
import nodemailer from "nodemailer";
import wbm from "wbm";
import paypal from "@paypal/checkout-server-sdk"
import CC from "currency-converter-lt"
import QRCode from "qrcode";


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
    getPassedEventDetails,
    addCoverPicture,
  getPhotoAlbum,
  getCoverPhotos} from "./db.js"
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

//Seeting up paypal environment
const Environment = 
process.env.NODE_ENV === "production"
    ?paypal.core.LiveEnvironment
    :paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
    new Environment(
        process.env.PAYPAL_CLIENT_ID, 
        process.env.PAYPAL_CLIENT_SECRET 
        )
    )

//Configure nodemailer with SMTP details
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: 465, 
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth:{
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function mailConfirmation(mailTo, bookingName, bookingSurname, contactNumber, bookingEvent,
  bookingType, bookingAlcohol, bookingFood, bookingTotal, qrCodeData){
    console.log("QR Code Data: ", qrCodeData)
  const info = await transporter.sendMail({
    from: "LeschisMore <ddlesch88@gmail.com>", // sender address
    to: mailTo, // list of receivers
    subject: "Booking Confirmation", // Subject line
    text: "This serves as an email to confirm the booking made at Cellars.", // plain text body
    html: `
    <h1> Booking Confirmation:</h1>
    <h5>Name: <span>${bookingName}</span></h5>
    <h5>Surname: <span>${bookingSurname}</span></h5>
    <h5>Contact Number: <span>${contactNumber}</span></h5>
    <h5>Event: <span>${bookingEvent}</span></h5>
    <h5>Booking Type: <span>${bookingType}</span></h5>
    <h5>Alcohol: <span>${bookingAlcohol}</span></h5>
    <h5>Food: <span>${bookingFood}</span></h5>
    <h5>Total R: <span>${bookingTotal}</span></h5>
    <img src="${qrCodeData}" alt= "QR CODE Image"/>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  
}

async function mailContactUs(backOfficeEmail, userName, userSurname, userContactNumber, userEmail, msgSubject, msgBody){
  const info = transporter.sendMail({
    from: "LeschisMore <ddlesch88@gmail.com>", // sender address
    to: backOfficeEmail, // list of receivers
    subject: msgSubject, // Subject line
    text: "Message Sent from Contact Us Page", // plain text body
    html: `
    <h1> ${msgSubject}</h1>
    <h5>Name: <span>${userName}</span></h5>
    <h5>Surname: <span>${userSurname}</span><h5/>
    <h5>Contact Number: <span>${userContactNumber}</span><h5/>
    <h5>Contact Number: <span>${userEmail}</span><h5/>
   <p> ${msgBody}</p>
    `, // html body
  }) 
}




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
    const paypalClientId = process.env.PAYPAL_CLIENT_ID
    res.render("booking", { events, booths, alcohol, food, paypalClientId});
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
    paypalCientId = process.env.PAYPAL_CLIENT_ID;
    res.render("booking", { events, booths, alcohol, food, paypalCientId });
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

app.get("/contact_us", async (req, res) =>{

  res.render("contact_us");
})

app.get("/get_posters", async (req, res) =>{
  const results = await getEventImageFileName();
  console.log("Event Results", results[0]);
  res.send(results);
})

app.get("/getPhotoAlbum", async (req, res) =>{
  const photoCovers = await getCoverPhotos();
  console.log("Photo Covers: ", photoCovers);
  const photoAlbum = await getPhotoAlbum();
  console.log("Photo Album: ", photoAlbum)
  const photoData = [photoCovers[0], photoAlbum[0]]
  res.send(photoData);
})

//Paypal Payment gateway
app.post("/payment-gateway", async (req, res) =>{
  const results = req.body
  const request = new paypal.orders.OrdersCreateRequest()
  var totalZAR = 0
  var details = []
  results.forEach(result =>{
  const userName = result["userName"];
  const userSurname = result["userSurname"];
  const eventSelected = result["eventSelected"];
  const boothSelected = result["boothSelected"];
  const alcoholSelected = result["alcoholSelected"];
  const foodSelected = result["foodSelected"];
  const totalPrice = result["totalPrice"];
  totalZAR = totalZAR + totalPrice

  console.log("results:", result, "\nUser Name: ", userName," ", userSurname, 
  "\nEvent: ", eventSelected, "\nBooth Type: ", boothSelected, "\nAlcohol: ", alcoholSelected,
   "\nFood: ", foodSelected, "\nTotal: R", totalZAR )
  })

  let currencyConverter = new CC({
    from: "ZAR",
    to: "USD",
    isDecimalComma: true
})

let conversion = await currencyConverter.convert(totalZAR);
  var totalUSD = conversion.toFixed(2);

  console.log("Before Coversion: ", conversion, "Amount in Dollars: ",totalUSD)

  request.prefer("return=representation")
    request.requestBody({
      intent: "CAPTURE",
        purchase_units:[{
          amount: {
            currency_code: "USD",
            value: totalUSD,
            breakdown: {
              item_total:{
                currency_code: "USD",
                value: totalUSD

            },
            },
          },
          transactions:[{
            item_list:{
              items: results.forEach(result =>{
                return{
                  name: result["eventSelected"],
                  unit_amount: {
                    currency_code: "USD",
                    value: result["totalPrice"],
                  },
                  quantity: "1"
                
                }
              }),
            }
          }]
          

        },
      ],
    })

    try{
      const order = await paypalClient.execute(request)
        console.log("order: ",order);
        res.json({id: order.result.id})
    }catch(e){
      res.status(500).json({error: e.message})
  }
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
  bookings.map(async booking => {
    const name = booking["userName"];
    const surname = booking["userSurname"];
    const email = booking["email"];
    const contactNumber = booking["contactNumber"];
    const event_id = booking["eventIDValue"];
    const eventSelected = booking["eventSelected"];
    const booth_id = booking["boothIDValue"];
    const boothSelected = booking["boothSelected"];
    const alcohol_id = booking["alcoholIDValue"];
    const alcoholSelected = booking["alcoholSelected"];
    const food_id = booking["foodIDValue"];
    const foodSelected = booking["foodSelected"];
    const totalPrice = booking["totalPrice"]

    const qrData = name + surname + eventSelected + boothSelected + alcoholSelected + foodSelected 
    const qrCodeData = await QRCode.toDataURL(qrData)
    //console.log("QR Code Data: ", qrCodeData)
    //const qrCodeToString = await QRCode.toString(qrCodeData)
    //console.log("Data to String: ", qrCodeToString)
    //const img = await QRCode.create(qrData);
    //console.log("QR Image: ", img)

    console.log("Booking Values:", event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email);
    
    createBooking(event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email)
    
    console.log("Email Details: \nName: ", name, "\nSurname: ", surname, "\ncontactNumber: ", contactNumber,
     "\nEmail Address: ", email, "\nEvent: ", eventSelected, "\nBooking Type: ", boothSelected, "\nAlcohol Selection: ", alcoholSelected,
     "\nFood Selected: ", foodSelected, "\nTotal Price: R", totalPrice);
     
    var mailAddress = [process.env.EMAIL_USERNAME, email];
     
     console.log ("Email Address Array", mailAddress, "User Name: ", name, "User Surname: ", surname)
     
    mailConfirmation(mailAddress, name, surname, contactNumber, eventSelected, boothSelected
      , alcoholSelected, foodSelected, totalPrice, qrCodeData).catch(console.error);
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
  const coverPicture = 1;

  console.log("Event Name: ", eventName, "\nEvent ID: ", eventID, "\nEvent Date: ", eventDate)
  console.log("File Names: ", fileNames);

  for (let i = 0; i < fileNames.length -1; i++){
    addPhotos(eventName, eventID, eventDate, fileNames[i]);
  }
  console.log(fileNames[fileNames.length-1])
  addCoverPicture(eventName, eventID, eventDate,fileNames[fileNames.length-1], coverPicture)

});

app.post("/send_message", async (req, res) => {
  const sendForm = req.body[0];
  const userName = sendForm["userName"];
  const userSurname = sendForm["userSurname"];
  const userContactNumber = sendForm["userContactNumber"];
  const userEmail = sendForm["userEmail"];
  const userSubject = sendForm["userSubject"];
  const userMessage = sendForm["userMessage"];
 
  console.log("Form Details: ", sendForm);

  console.log("User Name: ",userName, "\nUser Surname: ", userSurname
  , "\nUser Contact Number: ", userContactNumber, "\nUser Email: ", userEmail,
  "\nUser Subject: ", userSubject,"\nUser Message: ",   userMessage)

  const mailAddress = process.env.EMAIL_USERNAME;
  mailContactUs(mailAddress, userName, userSurname, userContactNumber, 
    userEmail, userSubject, userMessage).catch(console.error)


})

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000")
});

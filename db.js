import mysql from "mysql2";
import dotenv from "dotenv";
    dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getBookings() {
    const [rows] = await pool.query("SELECT * FROM booking");
    return rows
}

export async function getBookingInfo(name,surname){
    const [row] = await pool.query("SELECT\
        CONCAT(name, ' ', surname) AS Name,\
        event_info.description AS `Event`,\
        event_date AS `Booking Date`,\
        booth_info.type AS `Booking type`,\
        booth_info.seating AS `Pax`,\
        alcohol_selection.description AS `Alcohol Package`,\
        alcohol_selection.pricing AS `Alcohol Price`,\
        COALESCE(food_selection.description, 'No Food') AS `Food Package`,\
        COALESCE(food_selection.pricing,0) AS `Food Price`,\
        contact_number AS `Contact Number`,\
        email AS `Email`,\
        booking_date AS `Date Booked`,\
        (alcohol_selection.pricing + COALESCE(food_selection.pricing, 0)) AS `Total`\
    FROM booking\
    JOIN event_info ON booking.event_id = event_info.event_id\
    JOIN booth_info ON booking.booth_id = booth_info.booth_id\
    JOIN alcohol_selection ON booking.alcohol_id = alcohol_selection.alcohol_id\
    LEFT JOIN food_selection ON booking.food_id = food_selection.food_id\
    WHERE name = ? AND surname = ?;", [name, surname]);

    return row;
}

export async function getBookingInfoByID(bookingId){
    const [row] = await pool.query("SELECT\
        CONCAT(name, ' ', surname) AS Name,\
        event_info.description AS `Event`,\
        event_date AS `Booking Date`,\
        booth_info.type AS `Booking type`,\
        booth_info.seating AS `Pax`,\
        alcohol_selection.description AS `Alcohol Package`,\
        alcohol_selection.pricing AS `Alcohol Price`,\
        food_selection.description AS `Food Package`,\
        food_selection.pricing AS `Food Price`,\
        contact_number AS `Contact Number`,\
        email AS `Email`,\
        booking_date AS `Date Booked`,\
        (alcohol_selection.pricing + food_selection.pricing) AS `Total`\
    FROM booking\
    JOIN event_info ON booking.event_id = event_info.event_id\
    JOIN booth_info ON booking.booth_id = booth_info.booth_id\
    JOIN alcohol_selection ON booking.alcohol_id = alcohol_selection.alcohol_id\
    JOIN food_selection ON booking.food_id = food_selection.food_id\
    WHERE booking.booking_id=?;", [bookingId]);

    return row;
}

export async function getSpecBooking(eventID){

 try{
    
    const [row]= await pool.query(`SELECT
    CONCAT(b.name, ' ', b.surname) AS "Name",
        e.event_name AS "Event",
        e.event_date AS "Booking Date",
        bo.type AS "Booking type",
        bo.seating AS "Pax",
        a.description AS "Alcohol Package",
        a.pricing AS "Alcohol Price",
        COALESCE(f.description, "No Food") AS "Food Package",
        COALESCE(f.pricing, 0) AS "Food Price",
        b.contact_number AS "Contact Number",
        b.email AS "Email",
        b.booking_date AS "Date Booked",
        (a.pricing + COALESCE(f.pricing, 0)) AS "Total"
    FROM booking b
    LEFT JOIN event_info e ON b.event_id = e.event_id
    LEFT JOIN booth_info bo ON b.booth_id = bo.booth_id
    LEFT JOIN alcohol_selection a ON b.alcohol_id = a.alcohol_id
    LEFT JOIN food_selection f ON b.food_id = f.food_id
    WHERE e.event_id = ?;`, [eventID])
 return row;
}catch(error){
    console.error('Error fetching event by ID:', error);
    throw error;
}   
    
}
//Summary Queries
export async function getEventById(event_id){
    try{
        const [row]= await pool.query("SELECT * FROM event_info WHERE event_id = ?", [event_id])
    if (row.length === 0) {
        throw new Error(`Event with ID ${event_id} not found.`);
    }
 return row

}catch(error){
    console.error('Error fetching event by ID:', error);
    throw error;
}
}

export async function getBoothById(booth_id){
    try{
        const [row]= await pool.query("SELECT * FROM booth_info WHERE booth_id = ?", [booth_id])
        if (row.length === 0) {
            throw new Error(`Booth with ID ${booth_id} not found.`);
        }
     return row
    
    }catch(error){
        console.error('Error fetching booth by ID:', error);
        throw error;
    }
}

export async function getAlcoholById(alcohol_id){
    try{
        const [row]= await pool.query("SELECT * FROM alcohol_selection WHERE alcohol_id = ?", [alcohol_id])
        if (row.length === 0) {
            throw new Error(`alcohol with ID ${alcohol_id} not found.`);
        }
     return row
    
    }catch(error){
        console.error('Error fetching alcohol by ID:', error);
        throw error;
    }
}

export async function getFoodById(food_id){
    try{ const [row]= await pool.query("SELECT * FROM food_selection WHERE food_id = ?", [food_id])
    if (row.length === 0) {
        throw new Error(`Food with ID ${food_id} not found.`);
    }
 return row

}catch(error){
    console.error('Error fetching food by ID:', error);
    throw error;
}
}

export async function getEventDetails() {
    try{
    const [results] = await pool.query("SELECT event_id, event_date, CONCAT(event_name, '  ', CONVERT(event_date, CHAR)) AS eventType FROM event_info WHERE event_date >= CURDATE()");
    return results;
    }
    catch(error){
        console.error("Error fetching events: ", error);
        throw error;
    }
}
export async function getPassedEventDetails() {
    try{
    const [results] = await pool.query("SELECT event_id, event_date, CONCAT(event_name, '  ', CONVERT(event_date, CHAR)) AS eventType FROM event_info WHERE event_date >= DATE_SUB(CURDATE(), INTERVAL 3 WEEK)");
    return results;
    }
    catch(error){
        console.error("Error fetching events: ", error);
        throw error;
    }
}

export async function getBoothDetails(){
    try{
        const[results] = await pool.query("SELECT booth_id, CONCAT(type,' - ',CONVERT(seating, CHAR)) AS boothType FROM booth_info WHERE available = true");
        return results;
    } catch(error){
        console.error("Error fetching booth details: ", error)
        throw error;
    }
}
   
export async function getTest(event_id){
    try{
        //const results = await pool.query(`SELECT * FROM event_info WHERE event_id = ?`,[event_id])
    const[results] = await pool.query(`SELECT
    CONCAT(b.name, ' ', b.surname) AS "Name",
    e.description AS "Event",
    e.event_date AS "Booking Date",
    bo.type AS "Booking type",
    bo.seating AS "Pax",
    a.description AS "Alcohol Package",
    a.pricing AS "Alcohol Price",
    COALESCE(f.description, "No Food") AS "Food Package",
    COALESCE(f.pricing, 0) AS "Food Price",
    b.contact_number AS "Contact Number",
    b.email AS "Email",
    b.booking_date AS "Date Booked",
    (a.pricing + COALESCE(f.pricing, 0)) AS "Total"
FROM booking b
LEFT JOIN event_info e ON b.event_id = e.event_id
LEFT JOIN booth_info bo ON b.booth_id = bo.booth_id
LEFT JOIN alcohol_selection a ON b.alcohol_id = a.alcohol_id
LEFT JOIN food_selection f ON b.food_id = f.food_id
WHERE e.event_id = ?;`, [event_id])
    console.log('Booking info:', results);
        return results;
    }catch(error){
        console.error("Error in fetching booth details: ", error)
        throw error;
    }    
}

export async function getAlcohol(){
    try{
        const [results] = await pool.query("SELECT alcohol_id, CONCAT(description, ' - ', CONVERT(pricing, CHAR)) as alcoholType from alcohol_selection");
        return results;
    }catch(error){
        console.error("Error in fetching booth details: ", error)
        throw error;
    }
}

export async function getFood(){
    try{
        const [results] = await pool.query("SELECT food_id, CONCAT(description, ' - ', CONVERT(pricing,CHAR)) AS foodType from food_selection");
        return results;
    }catch(error){
        console.error("Error in fetching booth details: ", error)
        throw error;
    }
}

export async function createBooking(event_id, booth_id, alcohol_id, food_id, name, surname, contactNumber, email, qrCode ){
    try {
        let foodValue;
        if (food_id.trim()==""){
            foodValue = null;
        }
        else{
            foodValue = food_id
        }
        // Insert the booking data into the bookings table using the insertBooking function
        await pool.query("INSERT INTO booking \
        (event_id, booth_id, alcohol_id, food_id, name, surname, contact_number, email, booking_date)\
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())",[event_id, booth_id, alcohol_id, foodValue, name, surname, contactNumber, email]);
        
      } catch (error) {
        console.error('Error inserting booking data into the database:', error);
        
      }
}

export async function getAvailableBooths(eventId){
    try{
        const [results] = await pool.query(`
        SELECT booth_id, type, seating
        FROM booth_info
        WHERE booth_id NOT IN (SELECT booth_id FROM booking WHERE event_id = ?)`, [eventId]);
      return results;
      }catch (error) {
        console.error('Error fetching available booths from db:', error);
        throw error;
      }
}

export async function adminUserLogin(username, password){
    try{

        const [rows] = await pool.query('SELECT * FROM admin_user WHERE username = ? AND password = ?', [username, password]);
        return rows;

    } catch(error){
    console.log("Error in fetching booth details: ", error)
    throw error;
    }
}

export async function addEvent(eventDate, eventName, description, posterPath){
    try{

        const [rows] = await pool.query('INSERT INTO event_info (event_date, event_name, description, poster_path)\
        VALUES (?, ?, ?, ?)', [eventDate, eventName, description, posterPath]);
        return rows;

    } catch(error){
    console.log("Error in fetching booth details: ", error)
    throw error;
    }
} 

export async function addAdvertising(name, fileName, startDate, endDate){
    
    try{
    const rows = await pool.query('INSERT INTO advertisements (name, file_path, display_start_date, display_end_date ) VALUES (?, ?, ?, ?)', [name, fileName, startDate, endDate]);
    return rows;
    } catch{
    console.log("Error in fetching booth details: ", error)
    throw error;
    }
}

export async function addPhotos(eventName, eventId, eventDate, imageFile){

    try{
        const rows = await pool.query("INSERT INTO photo_album (event_name, event_id, event_date, image_file_name) VALUES (?, ?, ?, ?)", [eventName, eventId, eventDate, imageFile]);
        return rows;
        } catch{
        console.log("Error in fetching photo details: ", error)
        throw error;
        }
    
}
export async function addCoverPicture(eventName, eventId, eventDate, coverPhotoName, coverPicture){
    try{
        const rows = await pool.query("INSERT INTO photo_album (event_name, event_id, event_date, image_file_name, cover_picture) VALUES (?, ?, ?, ?, ?)", [eventName, eventId, eventDate, coverPhotoName, coverPicture])
        return rows;
    } catch{
        console.log("Error in fetching cover photo", error);
        throw error;
    }
}

export async function getAdvertisingImages(){
    try{
        const rows = await pool.query(`SELECT file_path FROM advertisements
        WHERE CURDATE() BETWEEN display_start_date AND display_end_date`);
        return rows;
        } catch{
        console.log("Error in fetching booth details: ", error)
        throw error;
        }
}

export async function getEventImageFileName(){
    try{
        const rows = await pool.query(`SELECT event_id, event_name, description, poster_path FROM event_info
        WHERE event_date >= CURDATE();`);
        return rows;
    }catch{
        console.log("Error in fetching booth details: ", error)
        throw error;  
    }
}

export async function getCoverPhotos(){
    try{
        const rows = await pool.query("SELECT * FROM photo_album WHERE event_date >= DATE_SUB(NOW(), INTERVAL 4 WEEK) AND cover_picture = 1;")
        return rows;
        console.log(rows);

    }catch{
        console.log("Error fetching cover photos", error)
        throw error;
    }
}

export async function getPhotoAlbum(){
    try{
        const rows = await pool.query("SELECT * FROM photo_album WHERE event_date >= DATE_SUB(NOW(), INTERVAL 4 WEEK) AND cover_picture = 0;")
        return rows
    }catch{
        console.log("Error fetching photo album", error)
        throw error;
    }
}

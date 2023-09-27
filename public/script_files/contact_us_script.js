if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
    } else {
        ready();
    }
    
    function ready(){

        const submitButton = document.getElementById("userFormButton")
        submitButton.addEventListener("click", postMessage);
    }

    async function postMessage(){
        var data =[]
        const userName = document.getElementById("userName").value
        const userSurname = document.getElementById("userSurname").value
        const userContactNumber = document.getElementById("userContactNumber").value
        const userEmail = document.getElementById("userEmail").value
        const userSubject = document.getElementById("userSubject").value
        const userMessage = document.getElementById("userMessage").value

        console.log("User Name: ", userName, "\nUser Surname: ", userSurname,
         "\nUser Contact Number: ", userContactNumber, "\nUser Email: ", userEmail,
          "\nUser Subject: ", userSubject, "\nUser Message: ",userMessage);

        //const formData = new FormData();

        //formData.append("userName", userName);
        //formData.append("userSurname", userSurname);
        //formData.append("userContactNumber", userContactNumber);
        //formData.append("userEmail", userEmail);
        //formData.append("userSubject", userSubject);
        //formData.append("userMessage", userMessage);
        data.push({userName, userSurname, userContactNumber, userEmail, userSubject, userMessage})
        try{
        console.log(data);
        const res = await fetch("/send_message",{

            method: "POST",
           
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            const result = await res.json();
            console.log("Sucesee: ",result);
        }catch(error){
            console.error("Error: ", error)
        }

    }
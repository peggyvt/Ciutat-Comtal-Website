var price;
function sendEventData(id) {
    /* EVENTS PAGE */
    /* (SPA show and hide divs using css display element) */
    document.getElementById("show-events").style.display = "none";
    document.getElementById("events-second-step").style.display = "block";
    
    var number = id.match(/\d+/);
    
    var img_name = document.getElementById("img-"+number).getAttribute("alt");
    var img_src = document.getElementById("img-"+number).getAttribute("src");
    var event_price = document.getElementById("price-"+number).innerText;

    document.getElementById("second-step-h4").innerHTML = img_name;
    document.getElementById("second-step-img").setAttribute("alt", img_name);
    document.getElementById("second-step-img").setAttribute("src", img_src);
    document.getElementById("second-step-img").setAttribute("class", event_price);

    // Local Time GMT +3
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.toJSON().slice(0,10);
    console.log("tmr "+tomorrow);
    document.getElementById("date").setAttribute("min", tomorrow.toJSON().slice(0,10));
    document.getElementById("date").setAttribute("value", tomorrow.toJSON().slice(0,10));

    // create a break line element
    var br = document.createElement("br");
    
    // get div total-price from HTML 
    var div_total_price = document.getElementById("total-price");
    document.getElementById("total-price").readOnly = true; 
    
    // create an input element for final reservation price
    var total_price = document.createElement("input");
    total_price.readOnly = true;
    var number_of_guests = document.getElementById("guests-button").value;
    
    price = number_of_guests*event_price;
    total_price.value = "Reservation Price: "+price+"€";

    total_price.setAttribute("class", "price");
    total_price.setAttribute("placeholder", "Reservation Price: ");
    
    div_total_price.appendChild(br.cloneNode());
    div_total_price.appendChild(total_price);
    div_total_price.appendChild(br.cloneNode());
}

function updateCost() {
    var number_of_guests = document.getElementById("guests-button").value;
    var event_price = document.getElementById("second-step-img").getAttribute("class");
    
    price = number_of_guests*event_price;

    document.getElementsByClassName("price")[0].value = "Reservation Price: "+price+"€";
}

function sendEventGuests() {
    // make previous fields read-only/disabled
    document.getElementById("date").readOnly = true; 
    document.getElementById("guests-button").disabled = true; 
    
    document.getElementById("second-form").style.display = "block";

    // get form from HTML 
    var form = document.getElementById("second-form");
    
    // create a break line element
    var br = document.createElement("br");
    // Inserting line break
    form.appendChild(br.cloneNode());
    
    // for each guest
    var number_of_guests = document.getElementById("guests-button").value;
    for(var i=0; i<number_of_guests; i++) { 
        // create an input element for heading
        var h4 = document.createElement("h4");
        h4.setAttribute("class", "guest_number");
        h4.innerHTML = "Guest-"+i;

        // create an input element for guest's name
        var name = document.createElement("input");
        name.setAttribute("type", "text");
        name.setAttribute("name", "name");
        name.setAttribute("class", "guest-name");
        name.setAttribute("placeholder", "enter name");

        // create an input element for guest's surname
        var surname = document.createElement("input");
        surname.setAttribute("type", "text");
        surname.setAttribute("name", "surname");
        surname.setAttribute("class", "guest-surname");
        surname.setAttribute("placeholder", "enter surname");
    
        // create an input element for guest's date of birth
        var DOB = document.createElement("input");
        DOB.setAttribute("type", "text");
        DOB.setAttribute("name", "date-of-birth");
        DOB.setAttribute("class", "guest-dob");
        DOB.setAttribute("placeholder", "enter date of birth");
        
        // create an input element for guest's ID number
        var ID = document.createElement("input");
        ID.setAttribute("type", "text");
        ID.setAttribute("name", "id-number");
        ID.setAttribute("class", "guest-id");
        ID.setAttribute("placeholder", "enter ID number");
    
        // append the h4 tag to the form
        form.appendChild(h4);

        // Append the name input to the form
        form.appendChild(name);
        form.appendChild(br.cloneNode());
        
        // Append the surname input to the form
        form.appendChild(surname);
        form.appendChild(br.cloneNode());

        // Append the date of birth to the form
        form.appendChild(DOB);
        form.appendChild(br.cloneNode());

        // Append the ID number to the form
        form.appendChild(ID);
        form.appendChild(br.cloneNode());
    }
    form.appendChild(br.cloneNode());

    // create a submit button
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "submit");
    button.setAttribute("class", "submit-button");
    button.setAttribute("onclick", "thirdEventStep()");
    form.appendChild(button);
    document.getElementById("guests-button_1").disabled = true; 
}

function thirdEventStep() {
    document.getElementById("div-third-step").style.display = "block";
    document.getElementById("reservation-button_1").style.display = "block";
    document.getElementById("events-second-step").style.display = "none";
    document.getElementById("show-events").style.display = "none";

    document.getElementById("event-name").value =  document.getElementById("second-step-img").getAttribute("alt");
    document.getElementById("event-date").value =  document.getElementById("date").value;
    console.log(document.getElementById("event-date").value);
    console.log(document.getElementById("date").value);
    document.getElementById("price").value = price;
    
    var num = Math.floor(Math.random() * Math.floor(99999));
    document.getElementById("random-num").value = num;

    var names = document.getElementsByClassName("guest-name");
    var surnames = document.getElementsByClassName("guest-surname");
    var DOBs = document.getElementsByClassName("guest-dob");
    var IDs = document.getElementsByClassName("guest-id");
    
    // get div from HTML 
    var event_guests = document.getElementById("event-guests");
    
    // create a break line element
    var br = document.createElement("br");
    
    for (var i=0; i<names.length; i++) {

        // create an input element for heading
        var h6 = document.createElement("h6");
        h6.setAttribute("class", "guest_number");
        h6.innerHTML = "Guest-"+i+":";

        // create an input element for guest's name
        var name = document.createElement("input");
        name.setAttribute("type", "text");
        name.setAttribute("name", "name");
        name.setAttribute("class", "events-guest-name");
        name.setAttribute("value", names.item(i).value);
        name.setAttribute("placeholder", "enter name");
        name.readOnly = true; 

        // create an input element for guest's surname
        var surname = document.createElement("input");
        surname.setAttribute("type", "text");
        surname.setAttribute("name", "surname");
        surname.setAttribute("class", "events-guest-surname");
        surname.setAttribute("value", surnames.item(i).value);
        surname.setAttribute("placeholder", "enter surname");
        surname.readOnly = true; 
    
        // create an input element for guest's date of birth
        var DOB = document.createElement("input");
        DOB.setAttribute("type", "text");
        DOB.setAttribute("name", "date_of_birth");
        DOB.setAttribute("class", "events-guest-dob");
        DOB.setAttribute("value", DOBs.item(i).value);
        DOB.setAttribute("placeholder", "enter date of birth");
        DOB.readOnly = true; 
        
        // create an input element for guest's ID number
        var ID = document.createElement("input");
        ID.setAttribute("type", "text");
        ID.setAttribute("name", "id_number");
        ID.setAttribute("class", "events-guest-id");
        ID.setAttribute("value", IDs.item(i).value);
        ID.setAttribute("placeholder", "enter ID number");
        ID.readOnly = true; 
    
        // append the h6 tag to the div
        event_guests.appendChild(h6);

        // Append the name input to the div
        event_guests.appendChild(name);
        event_guests.appendChild(br.cloneNode());
        
        // Append the surname input to the div
        event_guests.appendChild(surname);
        event_guests.appendChild(br.cloneNode());

        // Append the date of birth to the div
        event_guests.appendChild(DOB);
        event_guests.appendChild(br.cloneNode());

        // Append the ID number to the div
        event_guests.appendChild(ID);
        event_guests.appendChild(br.cloneNode());
        console.log(i, names.length);
    }
    event_guests.appendChild(br.cloneNode());
}
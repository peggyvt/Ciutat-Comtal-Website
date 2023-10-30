var diffDays = 0;
var price = 0;
function sendAccommodationData(id) {
    /* ACCOMMODATION PAGE */
    /* (SPA show and hide divs using css display element) */
    document.getElementById("div-accommodations-filter").style.display = "none";
    document.getElementById("div-first-step").style.display = "none";
    document.getElementById("div-second-step").style.display = "block";
    
    var number = id.match(/\d+/);
    
    var img_name = document.getElementById("img-"+number).getAttribute("alt");
    var img_src = document.getElementById("img-"+number).getAttribute("src");
    var acc_price = document.getElementById("price-"+number).getAttribute("class");
    
    document.getElementById("second-step-h4").innerHTML = img_name;
    document.getElementById("second-step-img").setAttribute("alt", img_name);
    document.getElementById("second-step-img").setAttribute("src", img_src);
    var p = document.getElementById("second-step-img").setAttribute("class", acc_price);

    // Local Time GMT +3
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.toJSON().slice(0,10);
    console.log("tmr "+tomorrow);
    document.getElementById("date-from").setAttribute("min", tomorrow.toJSON().slice(0,10));
    document.getElementById("date-from").setAttribute("value", tomorrow.toJSON().slice(0,10));
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById("date-to").setAttribute("min", tomorrow.toJSON().slice(0,10));
    document.getElementById("date-to").setAttribute("value", tomorrow.toJSON().slice(0,10));

    // create a break line element
    var br = document.createElement("br");
    
    // get div total-price from HTML 
    var div_total_price = document.getElementById("total-price");
    document.getElementById("total-price").readOnly = true; 
    
    // create an input element for final reservation price
    var total_price = document.createElement("input");
    total_price.readOnly = true;
    var number_of_guests = document.getElementById("guests-button").value;
    var accommodation_price = document.getElementById("second-step-img").getAttribute("class");

    var date_from_value = document.getElementById("date-from").value;
    var date_from = Date.parse(date_from_value);
    var date_to_value = document.getElementById("date-to").value;
    var date_to = Date.parse(date_to_value);
    
    var diffTime = Math.abs(date_to - date_from);
    diffDays = Math.ceil(diffTime / (1000*60*60*24));
    
    price = number_of_guests*diffDays*accommodation_price;
    console.log("diffDays: "+diffDays);
    console.log("price number: "+price);
    total_price.value = "Reservation Price: "+price+"€";

    console.log("Accommodation price per night: "+accommodation_price);
    total_price.setAttribute("class", "price");
    total_price.setAttribute("placeholder", "Reservation Price: ");
    
    div_total_price.appendChild(br.cloneNode());
    div_total_price.appendChild(total_price);
    div_total_price.appendChild(br.cloneNode());
}

function sendGuests() {
    // make previous fields read-only/disabled
    document.getElementById("date-from").readOnly = true; 
    document.getElementById("date-to").readOnly = true; 
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
    button.setAttribute("onclick", "thirdStep()");
    form.appendChild(button);
    document.getElementById("guests-button_1").disabled = true; 
}

function updateCost() {
    var number_of_guests = document.getElementById("guests-button").value;
    var accommodation_price = document.getElementById("second-step-img").getAttribute("class");
    var date_from_value = document.getElementById("date-from").value;
    console.log("date_from_value: "+date_from_value);
    var date_from = Date.parse(date_from_value);

    var date_to_value = document.getElementById("date-to").value;
    console.log("date_to_value: "+date_to_value);
    var date_to = Date.parse(date_to_value);
    console.log(date_to_value);
    
    var diffTime = Math.abs(date_to - date_from);
    diffDays = Math.ceil(diffTime / (1000*60*60*24));
    
    price = number_of_guests*diffDays*accommodation_price;

    document.getElementsByClassName("price")[0].value = "Reservation Price: "+price+"€";
}

function thirdStep() {
    document.getElementById("div-third-step").style.display = "block";
    document.getElementById("reservation-button").style.display = "block";
    document.getElementById("div-second-step").style.display = "none";
    document.getElementById("div-first-step").style.display = "none";

    document.getElementById("accommodation-name").value =  document.getElementById("second-step-img").getAttribute("alt");
    document.getElementById("accommodation-date-from").value =  document.getElementById("date-from").value;
    document.getElementById("accommodation-date-to").value =  document.getElementById("date-to").value;
    document.getElementById("days").value = diffDays;
    document.getElementById("price").value = price;
    
    var num = Math.floor(Math.random() * Math.floor(99999));
    document.getElementById("random-num").value = num;

    var names = document.getElementsByClassName("guest-name");
    var surnames = document.getElementsByClassName("guest-surname");
    var DOBs = document.getElementsByClassName("guest-dob");
    var IDs = document.getElementsByClassName("guest-id");
    
    // get div from HTML 
    var accommodation_guests = document.getElementById("accommodation-guests");
    
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
        name.setAttribute("class", "accommodations-guest-name");
        name.setAttribute("value", names.item(i).value);
        name.setAttribute("placeholder", "enter name");
        name.readOnly = true; 

        // create an input element for guest's surname
        var surname = document.createElement("input");
        surname.setAttribute("type", "text");
        surname.setAttribute("name", "surname");
        surname.setAttribute("class", "accommodations-guest-surname");
        surname.setAttribute("value", surnames.item(i).value);
        surname.setAttribute("placeholder", "enter surname");
        surname.readOnly = true; 
    
        // create an input element for guest's date of birth
        var DOB = document.createElement("input");
        DOB.setAttribute("type", "text");
        DOB.setAttribute("name", "date_of_birth");
        DOB.setAttribute("class", "accommodations-guest-dob");
        DOB.setAttribute("value", DOBs.item(i).value);
        DOB.setAttribute("placeholder", "enter date of birth");
        DOB.readOnly = true; 
        
        // create an input element for guest's ID number
        var ID = document.createElement("input");
        ID.setAttribute("type", "text");
        ID.setAttribute("name", "id_number");
        ID.setAttribute("class", "accommodations-guest-id");
        ID.setAttribute("value", IDs.item(i).value);
        ID.setAttribute("placeholder", "enter ID number");
        ID.readOnly = true; 
    
        // append the h6 tag to the div
        accommodation_guests.appendChild(h6);

        // Append the name input to the div
        accommodation_guests.appendChild(name);
        accommodation_guests.appendChild(br.cloneNode());
        
        // Append the surname input to the div
        accommodation_guests.appendChild(surname);
        accommodation_guests.appendChild(br.cloneNode());

        // Append the date of birth to the div
        accommodation_guests.appendChild(DOB);
        accommodation_guests.appendChild(br.cloneNode());

        // Append the ID number to the div
        accommodation_guests.appendChild(ID);
        accommodation_guests.appendChild(br.cloneNode());
        console.log(i, names.length);
    }
    accommodation_guests.appendChild(br.cloneNode());
}
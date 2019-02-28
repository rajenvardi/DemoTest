/* Function to navigate to previous page */
function previousCity() {
 reset();
 var current = $("#cityName").html();
 switch (current) {
  case "Perth":
   $("#cityName").html(current);
   break;
  case "Brisbane":
   $("#cityName").html("Perth");
   break;
  case "Melbourne":
   $("#cityName").html("Sydney");
   break;
  case "Sydney":
   $("#cityName").html("Brisbane");
   break;
  case "Adelaide":
   $("#cityName").html("Melbourne");
   break;
 }
}
/* Function to reset form data */
function reset() {
 $("#packageForm")[0].reset();
 $('#time').removeClass('disabled');
 $('#time').html('Time');

}

/* Function to navigate to next city */
function nextCity() {

 reset();
 var current = $("#cityName").html();
 switch (current) {
  case "Perth":
   $("#cityName").html("Brisbane");
   break;
  case "Brisbane":
   $("#cityName").html("Sydney");
   break;
  case "Melbourne":
   $("#cityName").html("Adelaide");
   break;
  case "Sydney":
   $("#cityName").html("Melbourne");
   break;
  case "Adelaide":
   $("#cityName").html("Adelaide");
   break;

 }
}


/*Function to change the city title in every page*/
function selectCity(name) {
 reset();
 $("#cityName").html(name);

}


function removeItem(city) {

 var index = -1;
 var obj = JSON.parse(localStorage.getItem("cityLog")) || {}; //fetch cart from storage

 for (var i = 0; i < obj.length; i++) { //loop over the collection
  if (obj[i].city == city) { //see if ids match

   obj.splice(i, 1); //remove item from array
   break; //exit loop
  }
 }
 localStorage.setItem("cityLog", JSON.stringify(obj)); //set item back into storage
}



/* Function to get current date time */
function getDate() {
 var today = new Date();
 var dateFormat = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
 var timeFormat = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
 return (dateFormat + ' ' + timeFormat);
}

var pkgLoc = ''

/* Function to get geolocation position */
function showPosition(position) {
 pkgLoc = position.coords.latitude + ' , ' + position.coords.longitude;
}

function getPkgLocation() {
 if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
 } else {
  pkgLoc = "No geolocation support.";
 }
}

/*Document ready*/
$(document).on('ready', function() {

 var logs = [];
 var shipTime = '';
 getPkgLocation();

 /*Updating time value in interface */
 $('#time').click(function(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  if ($(this).hasClass('disabled')) {
   return false;
  } else {
   shipTime = getDate();
   $('#time').addClass('disabled');
   $('#time').html(shipTime);

  }

 });

 /*Save log action*/
 $('body').on("click", '#btnSaveLog', function(event) {

  var cityLog = {
   "city": "",
   "time": "",
   "location": "",
   "contact": "",
   "invoice": "",
   "destination": ""

  };

  var invoiceNumber = $('div.ui-page-active').find("#invoice").val();
  var contactName = $('div.ui-page-active').find("#contact").val();
  var destination = $('div.ui-page-active').find("#destination").val();

  if (contactName == "") {

   $("#notificationMsg").html("You must enter a valid contact Name");
   $("#notificationId").attr("href", "#inputForm");
  } else if (invoiceNumber == "") {

   $("#notificationMsg").html("You must enter a valid Invoice Number");
   $("#notificationId").attr("href", "#inputForm");
  } else if (shipTime == "" || destination == "empty") {

   $("#notificationMsg").html("Check whether you input Time and Destination");
   $("#notificationMsg").html("Log not saved. Please fix all problems and try again.");
   $("#notificationId").attr("href", "#inputForm");
  } else {
   $("#notificationMsg").html("Log saved");
   $("#notificationId").attr("href", "#inputForm");

   cityLog.city = $("#cityName").html();
   cityLog.time = shipTime;
   cityLog.location = pkgLoc;
   cityLog.contact = $('div.ui-page-active').find("#contact").val();
   cityLog.invoice = $('div.ui-page-active').find("#invoice").val();
   cityLog.destination = destination;

   logs.push(cityLog);

   localStorage.setItem("cityLog", JSON.stringify(logs));

   selectCity($("#cityName").html());
  }
 });

 /*Send logs action */
 $("body").on("click", "#sendLogsPage_btn", function(event) {

  $("#sendLogsPage_btn").attr("href", "#sendLogsAlert");
  var city = $("#cityName").html();
  $("#btnSendLogs").on("click", function(event) {

   for (i = 0; i < localStorage.length; i++) {
    var item = localStorage.key(i);
    var items = JSON.parse(localStorage.getItem(item)); //Get Data from Key
    if (items && jQuery.isArray(items)) {
     items.forEach(function(data, index) {

      if (data.city == $("#cityName").html()) {

       var tempLog = {
        "city": data.city,
        "time": data.time,
        "location": data.location,
        "contact": data.contact,
        "invoice": data.invoice,
        "destination": data.destination

       };
       $.ajax({
        url: 'http://localhost:3000/city/' + city + '/log',
        method: 'POST',
        async: false,
        data: JSON.stringify(tempLog),
        contentType: 'application/json',
        success: function(response) {
         $("#sendLogsPage_btn").attr("href", "#jalert");
         $(".jalert").show();
         $("#jalert_content").html("City logs saved.");
        },
        error: function() {
         alert('Error in saving city logs.');
        }
       });

       removeItem(data.city);
      }
     });
    }
   }
   $("#notificationMsg").html("Logs sent");
   $("#notificationId").attr("href", "#cityDataDisplay");
   $("#cityDisplay").html("Data is cleared");

  });

 });

 /*Show logs action*/
 $("body").on("click", "#showLogs", function(event) {

  $("#logtopSection").html($("#cityName").html());
  $("#showLogs").attr("href", "#cityDataDisplay");
  logs = JSON.parse(localStorage.getItem("cityLog")) || [];

  localStorage.setItem("cityLog", JSON.stringify(logs));
  var noRecordflag = 1;
  var sizeOfLocalStorage = localStorage.length;
  if (sizeOfLocalStorage > 0) {
   var showLogsDisplay = "city,time,location,contact,invoice,destination<br>";


   for (i = 0; i < sizeOfLocalStorage; i++) {
    var item = localStorage.key(i); //Get  the Key
    var items = JSON.parse(localStorage.getItem(item)); //Get Data from Key
    if (items.length > 0) {
     if (items && jQuery.isArray(items)) {
      items.forEach(function(data, index) {
       if (data.city == $("#cityName").html()) {

        showLogsDisplay += "<div>" + data.city + ',';
        showLogsDisplay += data.time + ',';
        showLogsDisplay += pkgLoc + ',';
        showLogsDisplay += data.contact + ',';
        showLogsDisplay += data.invoice + ',';
        showLogsDisplay += data.destination + "</div><br>";
        noRecordflag = 0;
       }

      });
     }
    }
   }
   if (noRecordflag == 1) {
    showLogsDisplay += "---------------No Logs found----------------";
   }
   cityDisplay.innerHTML = showLogsDisplay;
  }
 });

 $("#getlogs").on('click', function() {
  var city = $("#cityName").html();
  var outputTable = "city,time,location,contact,invoice,destination<br>";
  $.ajax({
   url: 'http://localhost:3000/city/search/' + city,
   method: 'GET',
   success: function(response) {

    $(response).each(function(index, data) {
     outputTable += data.city + "<br>";
     outputTable += data.time + " , ";
     outputTable += data.location + " , ";
     outputTable += data.contact + " , ";
     outputTable += data.invoice + " , ";
     outputTable += data.destination + "<br>";

    });

    cloud_city_logs.innerHTML = outputTable;

   },
   error: function() {
    alert("No data from server.");
   }
  });
 });
});
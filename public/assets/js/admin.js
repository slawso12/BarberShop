
$(document).ready(function() {
  $(document).on("click", "#menu-toggle", function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

$.get("/setLocalStorageAdmin", function (data) {
  console.log(data.id);
  console.log("hit");
  localStorage.clear();
  localStorage.setItem("userId", data.id);
});

// for (var i = 0; i < newArray.length; i++) {
//   var $name = $("<div>", { class: "appendedName" });
//   $name.append(newArray[i]);
//   $name.addClass("col-md-3 border border-dark");
//   $name.appendTo("#nameAdmin");
// }
// button on click function to grab the values inputed by the IDs
// $(document).on("click", "#serviceButton", function (e) {
//   // alert("hello world");
//   let a = $("#newService").val();
//   let b = $("#estimatedTime").val();
//   let c = $("#newPrice").val();
//   let d = $("#serviceDescrption").val();

//   console.log("1" + a + "2" + b + "3" + c + "4" + d);
// });

// var timesArray = [];        //array that will hold the time slots available
//     var chosenDate;
//     var apptTime;
// $.get("/api/schedule/",function (data) {
//   timesArray = [];
//   timesArray = getTimeSlots(sortTimeData(data));
//             console.log(timesArray);
//             for (let i = 0; i < timesArray.length; i++) {              
//             // var $name = $("<div>", { class: "appendedName" });
//             // $name.append(newArray[i]);
//             // $name.addClass("col-md-3 border border-dark");
//             // $name.appendTo("#nameAdmin");
//             console.log(timesArray[i]);
//               // let temp = convertTime(timesArray[i])
//               // let newDiv = $("<div>").addClass("col-md-3 border border-dark")
//               //                 .attr("data-id", i).text(temp)
//               //                 .attr("data-toggle", "modal")
//               //                 .attr("data-target", "#scheduleModal");
//               // let btnDiv = $("<div>").append(timeBtn);    
//               console.log(data);
//           }
//       }).then(function (response1) {
//         console.log(response1);
//       })



// for (var i = 0; i < newArray.length; i++) {

// }

var dropdownArray = [];
var apptArray = [];

$.get("api/appointments/0", function (data) {
  apptArray = data;
  for (let i = 0; i < data.length; i++) {
    displayAppt(data[i]);
    if (!(dropdownArray.includes(convertDate(data[i].date)))) {
      dropdownArray.push(convertDate(data[i].date));
    }
  }
  console.log(dropdownArray);
  addToDropdown();

});

function apptFilter(dateSelected) {
  console.log(dateSelected);
  for (let i = 0; i < apptArray.length; i++) {
    if(dateSelected ==="Select Date") {
      displayAppt(apptArray[i]);
    }  
    else if(dateSelected === convertDate(apptArray[i].date)) {
      displayAppt(apptArray[i]);
    }
  }
};

function displayAppt(data) {
    let timeDiv = $("<div>").text(convertTime(data.start));
    $("#appointmentAdmin").append(timeDiv);

    let serDiv = $("<div>");
    let priceDiv = $("<div>");

    var price = 0;
    for (let j = 0; j < data.Services.length; j++) {
      price += parseInt(data.Services[j].price);
      if (j > 0) {
        serDiv.append(", " + data.Services[j].style)
      }
      else {
        serDiv.append(data.Services[j].style)
      }
    }
    priceDiv.text("$" + price);
    $("#priceAdmin").append(priceDiv);
    $("#haircutAdmin").append(serDiv);

    $.get("/api/customer/" + data.UserId, function (data) {
      let nameDiv = $("<div>").text(data[0].name);
      $("#nameAdmin").append(nameDiv);
    })
}

function addToDropdown() {
  for (var i = 0; i < dropdownArray.length; i++) {
    var newOption = $("<option>").text(dropdownArray[i]).addClass("dropdown1-options");
    // if(i === 0) {
    //   newOption.attr("selected", "selected");
    // }
    $("#dropdown1").append(newOption);
  }
  return;
}

$("#dropdown1").change(function(){
  var dateSelected = $("#dropdown1 :selected").text();
  $("#nameAdmin").empty();
  $("#priceAdmin").empty();
  $("#haircutAdmin").empty();
  $("#appointmentAdmin").empty();
  apptFilter(dateSelected);
});

  $(document).on("click", "#serviceButton", function(e) {
    event.preventDefault();
    let a = $("#newService").val();
    let b = $("#estimatedTime").val(); // convert to string?
    let c = $("#newPrice").val(); // convert to string?
    let d = $("#serviceDescription").val();
    // create an object
    var createService = {
      style: a,
      time: b,
      price: c,
      description: d
    };
    // console.log(a + b + c + d);
    // console.log("hello world", createService);
    // post to api service route
    $.ajax("/api/services", { type: "POST", data: createService }).then(
      function(data) {
        // console.log("added new services" + createService);
        // refresh each time button submits
        location.reload();
        console.log("string data",data);
      }
    );
  }); 
 
  function convertDate(inDate) {
    var newDate = inDate.split("-")[1] + "/" +inDate.split("-")[2] + "/" +inDate.split("-")[0]
    return newDate;
}

function convertTime(inTime) {
    var hourVar = parseInt(inTime.slice(0, 3));
    var minVar = inTime.slice(3);

    if (hourVar > 12) {
        hourVar = hourVar - 12;
        var hourStr = hourVar + ":" + minVar + "pm";
    }
    else if (hourVar === 12) {
        var hourStr = hourVar + ":" + minVar + "pm";
    }
    else {
        var hourStr = hourVar + ":" + minVar + "am";
    }

    return hourStr;
}

});


// for (var i = 0; i < newArray.length; i++) {
//   var $name = $("<div>", { class: "appendedName" });
//   $name.append(newArray[i]);
//   $name.addClass("col-md-3 border border-dark");
//   $name.appendTo("#nameAdmin");
// }
// button on click function to grab the values inputed by the IDs
// $(document).on("click", "#serviceButton", function (e) {
//   // alert("hello world");
//   let a = $("#newService").val();
//   let b = $("#estimatedTime").val();
//   let c = $("#newPrice").val();
//   let d = $("#serviceDescrption").val();

//   console.log("1" + a + "2" + b + "3" + c + "4" + d);
// });

// var timesArray = [];        //array that will hold the time slots available
//     var chosenDate;
//     var apptTime;
// $.get("/api/schedule/",function (data) {
//   timesArray = [];
//   timesArray = getTimeSlots(sortTimeData(data));
//             console.log(timesArray);
//             for (let i = 0; i < timesArray.length; i++) {              
//             // var $name = $("<div>", { class: "appendedName" });
//             // $name.append(newArray[i]);
//             // $name.addClass("col-md-3 border border-dark");
//             // $name.appendTo("#nameAdmin");
//             console.log(timesArray[i]);
//               // let temp = convertTime(timesArray[i])
//               // let newDiv = $("<div>").addClass("col-md-3 border border-dark")
//               //                 .attr("data-id", i).text(temp)
//               //                 .attr("data-toggle", "modal")
//               //                 .attr("data-target", "#scheduleModal");
//               // let btnDiv = $("<div>").append(timeBtn);    
//               console.log(data);
//           }
//       }).then(function (response1) {
//         console.log(response1);
//       })



// for (var i = 0; i < newArray.length; i++) {

// }

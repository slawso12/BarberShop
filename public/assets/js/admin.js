
$(document).ready(function () {
  $(document).on("click", "#menu-toggle", function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  $.get("/setLocalStorageAdmin", function (data) {
    console.log(data.id);
    console.log("hit");
    sessionStorage.setItem("userId", data.id); 
    userId = data.id
    $.get("/api/user/" + userId, function(data){
      $(".user-name").text(data.name);
    });
  });

  var dropdownArray = [];
  var apptArray = [];

  $.get("api/appointments/0", function (data) {
    apptArray = data;
    console.log(apptArray)
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
      if (dateSelected === "Select Date") {
        displayAppt(apptArray[i]);
      }
      else if (dateSelected === convertDate(apptArray[i].date)) {
        displayAppt(apptArray[i]);
      }
    }
  };


  // new display appt 
  function displayAppt(dataArray) {
    console.log(dataArray);
    
    getName(dataArray.UserId, function(data) {
      console.log(dataArray.UserId);

      var row = $("<tr>");
  
      let nameDiv = $("<th scope = 'row'>").text(data[0].name);
      let timeDiv = $("<td>").text(convertTime(dataArray.start));
      let serDiv = $("<td>");
      let priceDiv = $("<td>");
  
      var price = 0;
      for (let j = 0; j < dataArray.Services.length; j++) {
        price += parseInt(dataArray.Services[j].price);
        if (j > 0) {
          serDiv.append(", " + dataArray.Services[j].style)
        }
        else {
          serDiv.append(dataArray.Services[j].style)
        }
      }
      priceDiv.text("$" + price);
  
      row.append(nameDiv, serDiv, timeDiv, priceDiv);
      $(".appointments").append(row);
    })
  };
  
  function getName(id, cb) {
    $.get("/api/customer/" + id, function (data) {
      // console.log(data);
      cb(data);
    })
  };

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

  $("#dropdown1").change(function () {
    var dateSelected = $("#dropdown1 :selected").text();
    $(".appointments").empty();

    apptFilter(dateSelected);
  });

  $(document).on("click", "#serviceButton", function (e) {
    event.preventDefault();
    let a = $("#newService").val().trim();
    let b = $("#estimatedTime").val().trim(); // convert to string?
    let c = $("#newPrice").val().trim(); // convert to string?
    let d = $("#serviceDescription").val().trim();
    
    validate(a, "#newService", "string");
    validate(b, "#estimatedTime", "number");
    validate(c, "#newPrice", "number");
    validate(d, "#serviceDescription", "string");

    if(!validate(a, "#newService", "string") ||
      !validate(b, "#estimatedTime", "number") ||
      !validate(c, "#newPrice", "number") ||
      !validate(d, "#serviceDescription", "string")) {
        $("#validation-div").append(
          $("<div>")
            .attr("id", "validation-text")
            .attr("style", "color:red")
            .text("All fields not completed or wrong input entered"));
        
      }
      else {
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
          function (data) {
            // console.log("added new services" + createService);
            // refresh each time button submits
            location.reload();
            console.log("string data", data);
          }
        );
      }
  });

  function validate(field, tagId, type) {
    if($(`${tagId}`).hasClass("require-field")) {
      $(`${tagId}`).removeClass("require-field");
      $("#validation-text").remove();
    }

    if(field === "") {
      $(`${tagId}`).addClass("require-field");
      return false;
    }

    if(type === "string") {
      console.log(parseInt(field))
      if(!isNaN(parseInt(field))) {
        console.log(field + "not a string")
        $(`${tagId}`).addClass("require-field");
        return false;
      }
    }
    else { 
      if (isNaN(parseInt(field))) {
        $(`${tagId}`).addClass("require-field");
        return false;
      }
    }

    return true;

  }

  function convertDate(inDate) {
    var newDate = inDate.split("-")[1] + "/" + inDate.split("-")[2] + "/" + inDate.split("-")[0]
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


  getServices();

  function getServices() {
    $.get("/api/services", function (data) {
      for (var i = 0; i < data.length; i++) {
        $(".services-list").append(`
      <tr>
      <th scope='row'>${data[i].style}</th>
      <td>$${data[i].price}</td>
      <td>${data[i].time} min</td>
      <td>${data[i].description}</td>
      <td> <button class = 'btn btn-sm btn-warning edit-serv' data-toggle="modal" data-target="#edit" data-id = '${data[i].id}' data-price = '${data[i].price}' data-style ='${data[i].style}'><i class="fas fa-pencil-alt"></i></button> 
      
      <button class = 'btn btn-sm btn-danger del-serv' data-toggle="modal" data-target="#trash" data-id = '${data[i].id}'><i class="fas fa-trash-alt"></i></button></td>
  </tr>
      `)
      };
    });
  };

  var editId;

  $(document).on("click", ".edit-serv", function () {
    editId = $(this).data("id");
    $(".current-price").text($(this).data("price"));
    $(".current-style").text($(this).data("style"));
  });

  $(document).on("click", "#edit-price", function () {
    var edit = {
      id: editId,
      newPrice: parseInt($("#new-price").val().trim())
    }
    $.ajax("/api/services/edit",
      {
        type: "PUT",
        data: edit
      }).then(function (data) {
        location.reload();

      });
  });


//---------------------Delete a Service--------------------
  $(document).on("click", ".del-serv", function () {
    deleteId = $(this).data("id");
    $.ajax(`/api/services/${deleteId}/0`, {type: "GET"})
      .then( data => {
        if(data.length > 0) {
          $(".modal-body").html("Service cannot be deleted.<br>There are existing appointments of this service.");
        }
        else {
          $(".modal-body").text("Are you sure you want to delete this service?");
          $(".modal-footer").append(
            $("<button>")
              .attr("type", "button")
              .attr("id", "deleteConfirm")
              .addClass("btn btn-primary")
              .text("Yes, Delete"))
        }
      })
  });

  var deleteId;
  $(document).on("click", "#deleteConfirm", function () {

    console.log("id" + deleteId);
    $.ajax("/api/services/delete",
      {
        type: "DELETE",
        data: { id: deleteId }
      }).then(function (data) {
        location.reload();

      });

  });


  //-------------Set schedule times--------------------
  $("#submitNewSchedule").on("click", function(event) {
    event.preventDefault();
    $("#disp-msg").empty();

    var dateIn = $("#dateInput").val().trim();
    var startIn = $("#startInput").val().trim();
    var btn1 = $("input:radio[name='group1']:checked").val();
    var endIn = $("#endInput").val().trim();
    var btn2 = $("input:radio[name='group2']:checked").val();
    console.log(dateIn);
    
    if($("#checkboxIn").is(':checked')) {
      if(dateIn != "") {
        updateSchedule(dateIn, "0:0", "0:0", "am", "am");
      }
      else {
        $("#disp-msg").empty();
        $("#disp-msg").append($("<p>").addClass("disp-msg-alert").text("Please enter date"));
      }
    }
    else if(dateIn === "" || startIn === "" || endIn === "" || !$("input:radio[name='group1']").is(':checked') ||!$("input:radio[name='group2']").is(':checked')) {
      $("#disp-msg").empty();
      $("#disp-msg").append($("<p>").addClass("disp-msg-alert").text("Please complete all fields"));
    }
    else {
      updateSchedule(dateIn, startIn, endIn, btn1, btn2);
    }
    
  });
  
  function updateSchedule(dateIn, startIn, endIn, btn1, btn2) {
    $("#checkboxIn").prop("checked", false);
    $("#btn1").prop("checked", false);
    $("#btn2").prop("checked", false);
    $("#btn3").prop("checked", false);
    $("#btn4").prop("checked", false);

    $("#dateInput").val("");
    $("#startInput").val("");
    $("#endInput").val("");

    var dateInput = dateIn.split("/")[2] + "-" + dateIn.split("/")[0] + "-" + dateIn.split("/")[1];
    var startTime = convertTime2(startIn,btn1);
    var endTime = convertTime2(endIn, btn2);

    var obj1 = {
      date: dateInput,
      start: startTime,
      end: startTime,
      completed: 1
    };
    var obj2 = {
      date: dateInput,
      end: "0",
      start: endTime,
      completed: 1
    }

    $.post("/api/appointment", obj1, function(data) {
      console.log(data);
      $.post("/api/appointment", obj2, function(data) {
        console.log(data);
        $("#disp-msg").empty();
        $("#disp-msg").append($("<p>").addClass("disp-msg-success")
        .text("Your schedule for " + dateIn + " has been updated"));
      })
    })
  }

  function convertTime2(input, x) {
    var newTime;
    var temp = input.split(":")[0];

    if( (x === "pm" && temp < 12) ){
      temp = parseInt(temp) + 12;
    }
    else if (temp.length < 2) {
      temp = "0" + temp;
    }

    newTime = temp + ":" + input.split(":")[1];
    return newTime;
  }
});


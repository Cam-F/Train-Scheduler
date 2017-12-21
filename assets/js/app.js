// #tName
// #destination
// #time 
// #freq
// #btn-submit

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBd_p3vbNcwE12Mjlk0kEmedDAVMLInkp4",
    authDomain: "gct-train-scheduler.firebaseapp.com",
    databaseURL: "https://gct-train-scheduler.firebaseio.com",
    projectId: "gct-train-scheduler",
    storageBucket: "gct-train-scheduler.appspot.com",
    messagingSenderId: "1014635231831"
};
firebase.initializeApp(config);

var database = firebase.database();

var tName = "";
var destination = "";
var time = 0;
var freq = "";

// Get input from form
$("#btn-submit").on("click", function () {
    event.preventDefault();

    // catching the input
    tName = $(".tName").val();
    destination = $(".destination").val();
    time = $(".time").val();
    freq = $(".freq").val();

    // checks
    // console.log(tName);
    // console.log(destination);
    // console.log(time);
    // console.log(freq);

    // Push values to DB 
    database.ref().push({
        tName: tName,
        destination: destination,
        time: time,
        freq: freq,
    });

    // reset form
    $(".form-control").val(" ")
});
// Firebase watcher
database.ref().on("child_added", function (childSnapshot) {

    // checks
    // console.log(childSnapshot.val());

    // store everything in a variable
    var tName = childSnapshot.val().tName;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var freq = childSnapshot.val().freq;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

     // Current Time
     var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

     // Next Train
     var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    //appending to page
    $(".table").append("<tr><td>" + tName + "</td><td>" + destination + "</td><td>" + freq + "</td><td>" + moment(nextTrain).format("HH:mm a") + "</td><td>" + tMinutesTillTrain + "</td>");
});
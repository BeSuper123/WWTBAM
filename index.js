const express = require('express'); // Call express to be used by the application
const app = express(); // This is in place to make it easier to write express
app.set('view engine', 'ejs'); // Set the template engine
const path = require('path');  // Even if you don't like using it, it's very useful here!

app.set('views', path.join(__dirname, 'views')); // Allow access to the views folder
app.use(express.static("public")); // Allow access to the CSS folder

// allow access to the user code
const User = require("./classes/addUser");
const Questions = require("./classes/quizGame");

const quiz = new Questions(); // initialise quiz
var totalPoints = 0;
var num = 0;
var increment = 0;
var gameStarted = false;
var questionsAsked = [];

// allows the the extraction of an incoming request and makes it available using req.body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})) // parses form data

// home page
app.get('/', (req, res) => {
    res.render('home'); 

    console.log("\nI SEE THE HOME PAGE")
});

// rules page
app.get('/rules', (req, res) => {
    res.sendFile("home.ejs");
    res.render("rules"); 

    console.log("\nI SEE THE RULES PAGE")
});

// start page
app.get('/start', (req, res) => {
    res.render("bufferStartGame"); 

    console.log("\nI SEE THE START PAGE")
});

// game page
app.get('/game', (req, res) => {
    if (gameStarted == false) {
        num = 1;
    }

    gameStarted = true;
    if (req.query.correct == "true") {
        num++;
        totalPoints += 62500;
        req.query.correct = "false";
    }

    var allQuestions = require("./models/questions.json");

    do {
        number = Math.floor(Math.random() * allQuestions.length);
    } 
    while (questionsAsked.includes(number))

    if (questionsAsked.includes(number)) {
        console.log("already asked");
    }

    questionsAsked.push(number);


    const randomQuestion = allQuestions[number];
    
    console.log(randomQuestion.question)

    if (num == 17) {
        res.redirect("/won");
    } else {
        res.render("qPg1", {randomQuestion, totalPoints, num}); 

        console.log(num);
    }

    console.log("\nI SEE THE GAME PAGE")
});



// lose page
app.get('/lose', (req, res) => {
    res.render("losePg"); 

    console.log("\nI SEE THE LOSS PAGE")
    num = 1;
    totalPoints = 0
});

// win page
app.get('/won', (req, res) => {
    res.render("winPg"); 

    console.log("\nI SEE THE WIN PAGE")
    num = 1;
    totalPoints = 0;
});



// ------------------------- winners SIDE ----------------- //

// winners page
app.get('/players', (req, res) => {
    var userList = User.allUsers();

    res.render("allPlayers", {userList}); 

    console.log("\nI SEE THE PLAYER ATTEMPT PAGE")
});

// user add page
app.get('/userAdd', (req, res) => {
    res.render("userAdd"); 

    console.log("\nWLCOME TO THE USER ADD PAGE")
});

// directs where each new user goes
app.post('/userAdd', function(req, res) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const newUser = new User(req.body.user, today)

    // this sends an error message when the user doesn't add a username or comment
    if (!req.body.user) {
  
        var message = newUser.errors()
    
        res.render("error", {message})

        console.log("\nERROR ERROR")
    } 
    
    // this sends the thank you message to terminal
    else {
        // adds user
        newUser.addUser()
        
        console.log(`\nUser added: ${req.body.user}, Date Today: ${today}`);
        res.redirect("/start"); // Redirect to players list
    }
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Optionally, perform cleanup and exit gracefully
});
  
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally, perform cleanup and exit gracefully
});

if (process.env.VERCEL) {
    // When deployed to Vercel, export the app as a module
    module.exports = app;
} else {
    // We need to set the requirements for the application to run
    app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
        console.log("App is Running ......... Yessssssssssssss!")
    });
}
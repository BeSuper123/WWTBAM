const express = require('express'); // Call express to be used by the application
const app = express(); // This is in place to make it easier to write express
const serverless = require("serverless-http");
app.set('view engine', 'ejs'); // Set the template engine

app.use(express.static("views")); // Allow access to the CSS folder
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
var attempts = 0;
var user = "";
var wonGame = false;

// allows the the extraction of an incoming request and makes it available using req.body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true})) // parses form data

// home page
app.get("/", (req, res) => {
    res.render("home"); 

    console.log("\nI SEE THE HOME PAGE")
    attempts = 1;
});

// rules page
app.get('/rules', (req, res) => {
    res.render("rules"); 

    console.log("\nI SEE THE RULES PAGE")
});

// start page
app.get('/start', (req, res) => {
    res.render("bufferStartGame"); 

    console.log("\nI SEE THE START PAGE")
    attempts++;
});

// game page
app.get('/game', (req, res) => {
    if (gameStarted == false) {
        num = 1;
        attempts = 1;
    }

    gameStarted = true;
    if (req.query.correct == "true") {
        num++;
        totalPoints += 62500;
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
    
    console.log(randomQuestion.question);

    // Shuffle options properly
    var options = [...randomQuestion.options]; // Copy the options array
    options.sort(() => Math.random() - 0.5); // Shuffle

    // Find the new correct answer index
    var correctNo = options.indexOf(randomQuestion.options[randomQuestion.correctAns]);

    // Update the correct answer index
    randomQuestion.correctAns = correctNo;

    if (num == 17) {
        res.redirect("/won");
    } else {
        res.render("qPg1", {randomQuestion, options, totalPoints, num}); 

        console.log(num);
    }

    console.log("\nI SEE THE GAME PAGE")
});



// lose page
app.get('/lose', (req, res) => {
    if (attempts == 10) {
        res.render("losePg2", {attempts});
    } else {
        res.render("losePg", {attempts}); 
    }

    console.log("\nI SEE THE LOSS PAGE")

    num = 1;
    totalPoints = 0
    wonGame = false;
});

// win page
app.get('/won', (req, res) => {
    res.render("winPg", {attempts}); 

    console.log("\nI SEE THE WIN PAGE")
    num = 1;
    totalPoints = 0;
    wonGame = true;
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

    console.log("\nWELCOME TO THE USER ADD PAGE")
});

// directs where each new user goes
app.post('/userAdd', function(req, res) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const newUser = new User(req.body.user, today, attempts)
    username = req.body.user;

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
        var message = newUser.thankYous(wonGame)
        
        console.log(`\nUser added: ${req.body.user}, Date Today: ${today}, Attempts: ${attempts}`);
        res.render("thankYou", {message, username}); // Redirect to players list
    }
})

// user add page
app.get('/thankYou', (req, res) => {
    res.render("userAdd"); 

    console.log("\nWLCOME TO THE USER ADD PAGE")
});

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
    module.exports.handler = serverless(app); // Needed for Vercel
} else {
    // We need to set the requirements for the application to run
    app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
        console.log("App is Running ......... Yessssssssssssss!")
    });
}
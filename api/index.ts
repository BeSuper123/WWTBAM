import express, { Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import User from "../classes/addUser"; // Ensure correct import
const Questions = require("../classes/quizGame.js");
import allQuestions from "../models/questions.json"; // Proper TypeScript import

const app =  express();

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const quiz = new Questions();
var totalPoints = 0;
var num = 0;
var increment = 0;
var gameStarted = false;
var number = 0;
var questionsAsked: number[] = [];
var attempts = 0;
var user = "";
var wonGame = false;

// 🏠 Home Page
app.get("/", (req: Request, res: Response) => {
    res.render("home");
    console.log("\nI SEE THE HOME PAGE");
    attempts = 1;
});

// 📜 Rules Page
app.get("/rules", (req: Request, res: Response) => {
    res.render("rules");
    console.log("\nI SEE THE RULES PAGE");
});

// 🚀 Start Page
app.get("/start", (req: Request, res: Response) => {
    res.render("bufferStartGame");
    console.log("\nI SEE THE START PAGE");
    attempts++;
});

// 🎮 Game Page
app.get("/game", (req: Request, res: Response) => {
    if (!gameStarted) {
        num = 1;
        attempts = 1;
    }
    
    gameStarted = true;

    if (req.query.correct === "true") {
        num++;
        totalPoints += 62500;
    }

    // Ensure allQuestions is properly loaded
    if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        return res.status(500).send("Error loading questions.");
    }

    do {
        number = Math.floor(Math.random() * allQuestions.length);
    } while (questionsAsked.includes(number));

    questionsAsked.push(number);
    const randomQuestion = allQuestions[number];

    console.log(randomQuestion.question);

    // Shuffle options
    var options = [...randomQuestion.options];
    options.sort(() => Math.random() - 0.5);

    // Find the new correct answer index
    var correctNo = options.indexOf(randomQuestion.options[randomQuestion.correctAns]);
    randomQuestion.correctAns = correctNo;

    if (num === 17) {
        res.redirect("/won");
    } else {
        res.render("qPg1", { randomQuestion, options, totalPoints, num });
        console.log(num);
    }

    console.log("\nI SEE THE GAME PAGE");
});

// ❌ Lose Page
app.get("/lose", (req: Request, res: Response) => {
    res.render("losePg", { attempts });
    console.log("\nI SEE THE LOSS PAGE");
    num = 1;
    totalPoints = 0;
    wonGame = false;
});

// 🏆 Win Page
app.get("/won", (req: Request, res: Response) => {
    res.render("winPg", { attempts });
    console.log("\nI SEE THE WIN PAGE");
    num = 1;
    totalPoints = 0;
    wonGame = true;
});

// 🎉 Winners Page
app.get("/players", (req: Request, res: Response) => {
    var userList = User.allUsers();
    res.render("allPlayers", { userList });
    console.log("\nI SEE THE PLAYER ATTEMPT PAGE");
});

// 👤 Add User Page
app.get("/userAdd", (req: Request, res: Response) => {
    res.render("userAdd");
    console.log("\nWELCOME TO THE USER ADD PAGE");
});

// 📩 Handle User Submission
app.post("/userAdd", (req: Request, res: Response) => {
    const today = new Date().toISOString().split("T")[0];
    const newUser = new User(req.body.user, today, attempts);
    var username = req.body.user;

    if (!req.body.user) {
        var message = newUser.errors();
        res.render("error", { message });
        console.log("\nERROR: Missing Username");
    } else {
        newUser.addUser();
        var message = newUser.thankYous(wonGame);
        console.log(`\nUser added: ${username}, Date: ${today}, Attempts: ${attempts}`);
        res.render("thankYou", { message, username });
    }
});

// 🛑 Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Internal Server Error:", err.message);
    res.status(500).send("Something went wrong!");
});

const PORT: number = parseInt(process.env.PORT || "3000", 10);
const HOST: string = process.env.IP || "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`✅ App is running on http://${HOST}:${PORT} ......... Yessssssssssssss!`);
});

// 🚀 Serverless Export for Vercel
const handler = serverless(app);
export {handler};

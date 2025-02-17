var fs = require('fs');

const Questions = require("./questions");
const totalPoints = 0;

module.exports = class QuizGame extends Questions {

    getQuestion() {
        if (this.currentIndex >= this.questions.length) {
            return null; // No more questions
        }

        return this.questions[this.currentIndex];
    }

    myTimer() {
        const timer = new Date();
        document.getElementById("timer").innerHTML = timer.innerText = `${minute}:${tenSecond}${second}`;
    
        if (second < 9) {
            second++;
        } else if (second == 9 && tenSecond != 5) {
            second = 0;
            tenSecond++;
        } else if (second == 9 && tenSecond == 5) {
            second = 0;
            tenSecond = 0;
            minute++;
        }
    
        if (minute == 1 && second == 1) {
            loss = "time ran out";
            window.location.href = "./losePg.html"; // Redirect to lose page
        }
    }

    checkAnswer(ans) {
        if (correctAns == ans) {
            totalPoints += 100000
            nextQuestion();
        } else {
            window.location.href = "./losePg.html"; // Redirect to lose page
        }
    }

    resetGame() {
        this.currentIndex = 0;
        this.totalPoints = 0;
    }
}

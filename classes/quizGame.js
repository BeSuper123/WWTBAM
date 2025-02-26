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

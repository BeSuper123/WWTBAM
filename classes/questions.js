var fs = require('fs')

module.exports = class Questions {
    constructor(qNo, quest, options, correctAns) {
        this.qNo = qNo;
        this.quest = quest;
        this.options = options;
        this.correctAns = correctAns;
    }       
}
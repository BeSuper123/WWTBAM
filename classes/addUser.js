var fs = require('fs')

module.exports = class User {
    
    constructor (user, datePlayed) {
        this.user = user;
        this.datePlayed = datePlayed;
    }

    addUser() {
        var userFile = require("../models/players.json");

        // these next lines make a new user based on the text box inputs
        var newUser = {
            user: this.user,
            datePlayed: this.datePlayed
        };

        // this next line creates a function to write back to the file opened    
        fs.readFile("./models/players.json", 'utf8',  function readfileCallback(err) {
            
            // this if statement looks for an error if there is one 
            if(err) {
                throw(err) 
            } 

            else {

                // these next lines of code send the new comment back to the file we opened above
                userFile.push(newUser); // add the new data to the JSON file

                var json = JSON.stringify(userFile, null, 4); // this line structures the JSON so it is easy on the eye

                fs.writeFile('./models/players.json',json, 'utf8', function(){});
                                
            }

        });


    }

    static allUsers() {
        var allUsers = require("../models/players.json");

        return allUsers;
    }

    errors() {

        return "An error has occured when adding user. Username cannot be left blank and must be unique!"

    }

}
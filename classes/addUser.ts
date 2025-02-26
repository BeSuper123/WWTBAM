import fs from "fs";  // ✅ Use ES6 import for File System
import path from "path";
import players from "../models/players.json"; // ✅ Use proper TypeScript JSON import

interface IUser {
    user: string;
    datePlayed: string;
    attempts: number;
}

export default class User {
    user: string;
    datePlayed: string;
    attempts: number;

    constructor(user: string, datePlayed: string, attempts: number) {
        this.user = user;
        this.datePlayed = datePlayed;
        this.attempts = attempts;
    }

    addUser(): void {
        try {
            const filePath = path.resolve(__dirname, "../models/players.json");

            // Create a new user object
            const newUser: IUser = {
                user: this.user,
                datePlayed: this.datePlayed,
                attempts: this.attempts,
            };

            // Read existing users
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    console.error("Error reading file:", err);
                    throw err;
                }

                let userFile: IUser[] = [];

                try {
                    userFile = JSON.parse(data);
                } catch (parseErr) {
                    console.error("Error parsing JSON:", parseErr);
                }

                // Add new user to the list
                userFile.unshift(newUser);

                // Convert back to JSON and write to file
                fs.writeFile(filePath, JSON.stringify(userFile, null, 4), "utf8", (writeErr) => {
                    if (writeErr) {
                        console.error("Error writing to file:", writeErr);
                    }
                });
            });
        } catch (error) {
            console.error("Error in addUser method:", error);
        }
    }

    static allUsers(): IUser[] {
        try {
            return players as IUser[];
        } catch (error) {
            console.error("Error loading users:", error);
            return [];
        }
    }

    errors(): string {
        return "An error has occurred when adding user. Username cannot be left blank and must be unique!";
    }

    thankYous(wonGame: boolean): string {
        return wonGame ? "Congrats on Winning" : "Playing Hard Luck";
    }
}
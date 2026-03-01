const mysql = require('mysql2/promise');
require('dotenv').config();

const passwordsToTry = [
    "",
    "root",
    "admin",
    "password",
    "123456",
    "1234",
    "siva" // original one
];

async function checkPasswords() {
    console.log("Attempting to find the correct password for 'root' user...");

    for (const password of passwordsToTry) {
        process.stdout.write(`Trying password: "${password}" ... `);
        try {
            const connection = await mysql.createConnection({
                host: 'mysql.railway.internal',
                user: 'root',
                password: hdxVeWwBqQejIZVBDyuvyPTaRcVGvmGa
            });
            console.log("SUCCESS! ✅");
            console.log(`\nThe correct password is: "${password}"`);
            await connection.end();
            process.exit(0);
        } catch (error) {
            console.log("Failed ❌");
        }
    }

    console.log("\nCould not find the password among common defaults.");
    process.exit(1);
}

checkPasswords();

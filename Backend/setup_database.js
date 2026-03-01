const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

async function setupDatabase() {
    try {
        console.log('Environment variables loaded:');
        console.log(`MYSQL_HOST: ${MYSQL_HOST}`);
        console.log(`MYSQL_USER: ${MYSQL_USER}`);
        console.log(`MYSQL_PASSWORD: ${MYSQL_PASSWORD ? '***' : 'undefined'}`);
        console.log(`MYSQL_DATABASE: ${MYSQL_DATABASE}`);

        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
        });

        console.log(`Creating database "${MYSQL_DATABASE}" if it does not exist...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;`);

        console.log(`Switching to database "${MYSQL_DATABASE}"...`);
        await connection.changeUser({ database: MYSQL_DATABASE });

        console.log('Reading SQL file...');
        const sqlPath = path.join(__dirname, '../../tabels.sql');

        let sql;
        try {
            sql = fs.readFileSync(sqlPath, 'utf8');
        } catch (err) {
            // Fallback or detailed error
            console.error(`Could not find sql file at ${sqlPath}`);
            console.log('Trying alternative path ../tabels.sql');
            const sqlPathAlt = path.join(__dirname, '../tabels.sql');
            try {
                sql = fs.readFileSync(sqlPathAlt, 'utf8');
            } catch (e) {
                console.error(`Could not find sql file at ${sqlPathAlt} either.`);
                throw err;
            }
        }

        console.log('Executing SQL file...');
        const statements = sql
            .replace(/(\r\n|\n|\r)/gm, " ") // replace newlines with spaces
            .split(';') // split by semicolon
            .filter(statement => statement.trim().length > 0); // remove empty statements

        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await connection.query(statement);
                    console.log(`Executed: ${statement.substring(0, 50)}...`);
                } catch (sqlErr) {
                    console.error(`Error executing statement: ${statement}:`, sqlErr.message);
                }
            }
        }

        console.log('Database setup completed successfully!');
        await connection.end();
    } catch (error) {
        console.error('Error setting up database:');
        console.error(error.message);
        console.error(error.stack);
        if (error.code) console.error(`Error code: ${error.code}`);
        process.exit(1);
    }
}

setupDatabase();

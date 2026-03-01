const db = require('./config/db');

async function checkSchema() {
    try {
        const [rows] = await db.query('DESCRIBE entry');
        console.log('Schema of entry table:');
        console.table(rows);
    } catch (err) {
        console.error('Error describing table:', err.message);
    } finally {
        process.exit();
    }
}

checkSchema();

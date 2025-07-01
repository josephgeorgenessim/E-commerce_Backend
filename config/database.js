const mongoose = require('mongoose');


const dbConnection = () => {
    const dbUrl = process.env.URL_DB;
    if (!dbUrl) {
        console.error('Error: URL_DB is not defined in the .env file');
        process.exit(1);
    }

    mongoose.connect(dbUrl)
        .then((conn) => {
            console.log(`DONE CONNECTED ${conn.connection.host}`);
        })
        .catch((error) => {
            console.error(`Database Error: ${error}`);
            process.exit(1);
        });
};

module.exports = dbConnection;
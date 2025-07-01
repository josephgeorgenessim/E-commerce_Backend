const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoutes');

dotenv.config({ path: 'config.env' })
const app = express();

const PORT = process.env.PORT;

app.use(express.json())
dbConnection();

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))

}
// Mount Routes 
app.use('/api/v1/categories', categoryRoute)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./routes/serverRouter');
const dotenv = require('dotenv');

dotenv.config();

var corsOptions = {
    origin: process.env.LOCALHOST_HOST,
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
}


// - config cors 
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

app.get('/', (req, res, next) => {
    console.log('adsasdasdasdasd')
    res.status(200).json({ message: 'welcome to server' })
})

app.listen(`${process.env.PORT}`, async () => {
    console.log(`listening on port 5000`);
    mongoose.connect(process.env.MONGODB_URL)
        .then(
            console.log('db connected')
        ).catch(error => {
            console.log(error)
        })
});

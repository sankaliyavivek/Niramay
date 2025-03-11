const express = require('express');
const cors = require('cors');
require('./connect');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000", "https://niramayclinic.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use((req, res, next) => {
    const allowedOrigins = ["http://localhost:3000", "https://niramayclinic.netlify.app"];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    next();
});


const User = require('./router/user');
const Patients = require('./router/patients');

app.use('/user', User);
app.use('/patients', Patients);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

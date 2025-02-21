const express = require('express');
const app = express();
const cors = require('cors');
require('./connect');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://niramayclinic.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","niramayclinic.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,


}
))

const Patients = require('./router/patients');

app.use('/patients', Patients);


const PORT = 9000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
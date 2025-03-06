const express = require('express');
const cors = require('cors');
require('./connect');

const app = express();

// Middleware order fixed: express.json() comes before routes
app.use(express.json());
const corsOptions = {
    origin: ["http://localhost:9000", "https://niramayclinic.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));


// Set custom headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://niramayclinic.netlify.app/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Import Routes
const Patients = require('./router/patients');
app.use('/patients', Patients);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


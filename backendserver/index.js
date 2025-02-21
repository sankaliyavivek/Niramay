const express = require('express');
const app = express();
const cors = require('cors');
require('./connect');



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
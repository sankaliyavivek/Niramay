const mongooes = require('mongoose');

mongooes.connect(process.env.MONGO_URI)
.then(()=>{console.log('connect!')})

module.exports= mongooes.connect;
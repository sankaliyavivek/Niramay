const mongooes = require('mongoose');

mongooes.connect('mongodb+srv://sankaliya200310:hVceOULeEGTYdgeY@cluster1.6lmgz.mongodb.net/mypatients',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

.then(()=>{console.log('connect!')})

module.exports= mongooes.connect;
const mongoose = require('mongoose');

function connect(url){
    mongoose
        .connect(url)
        .then(console.log("DB connected"))
        .catch((err)=>console.log(err))
}

module.exports={connect};


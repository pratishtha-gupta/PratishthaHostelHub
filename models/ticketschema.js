const mongoose = require('mongoose');

const ticket = mongoose.Schema({

    room_number:{
        type: BigInt
    },
    problem:{
        type:"String"
    },
    issue_type:{
        type:"String"
    }

})

const ticket_model = mongoose.model("tckts", ticket);

module.exports = ticket_model;



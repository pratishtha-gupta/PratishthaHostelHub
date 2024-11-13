const mongoose = require('mongoose');

const student_info = mongoose.Schema({
    student_roll:{
        type:"String"
    },
    student_name:{
        type:"String"
    },
    room_alloted:{
        type:Boolean
    },
    room_number:{
        type: BigInt
    },
    hostel:{
        type:"String"
    }
})

const student_information = mongoose.model("std_info",student_info);

module.exports = student_information;



const express = require("express");
const fs = require('fs');
const ticket_model =require('./models/ticketschema')
const student_information = require('./models/studentinfo')
const app =express();
const port = 8000;

const {connect} = require('./connection')

app.use(express.urlencoded({extended:false}));

const dataMap = new Map();
const room_available = new Map();
const room_single = new Map();
const admin_map = new Map();


fs.readFile('password.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    try {
      const lines = data.trim().split('\n');
      lines.forEach(line => {
      const [key, value] = line.trim().split(' ');
      dataMap.set(key, value);
    });
    console.log(dataMap);   
}
    catch (err) {
        console.error('Error parsing data:', err);
    }
});

app.use(express.urlencoded({extended:false}));

connect('mongodb://127.0.0.1:27017/project_hostel_all');


// student routes 
function check_if_room_avaiable(room){
    if(room_available.get(room)==1){
        return false;
    }
    return true;
}

function check_if_room_single(room){
    if(room_single.get(room)==1){
        return true;
    }
    return false;
}


app.use((req,res,next)=>{
    if(req.params){
        next();
    }
    else{
        console.log("enter data");
        res.json("enter data");
        res.end();
    }
})

app.get('/login', async (req ,res)=> {
    // console.log(req.body)   
    // console.log(req.body.id);
    // console.log(req.body.pass);

    if (dataMap.get(req.body.id)==req.body.pass) {
        // res.redirect();
        res.send("login done");
    }
    else{
        res.send({message:"failed"});
    }
    res.end();
})


app.post('/compliant', async(req,res)=>{
    var t = req.body;
    var room_nu = t.room;
    var complaint = t.complaint;
    var issue_type = t.issue_type;

    console.log(room_nu);
    console.log(complaint);

    const result = ticket_model.create({
        room_number: room_nu,
        problem : complaint,
        issue_type: issue_type
    })

    res.send("done");

    res.end();
})


app.post('/book_single',async(req,res)=>{
    //name roll email-id phone number dob room_num

    // console.log(req.body)
    if(!req){
        res.send({"enter valid information":"1"});
        res.end();
    }

    const student = await student_information.findOne({ student_roll: req.body.roll });
    if(student){
        // console.log(student)
        console.log("already booked");
    }
    else{

        if(check_if_room_avaiable(req.body.room)){}
        else{
            res.send("room already booked");
            res.end();
        }

        if(check_if_room_single(req.body.room)){}
        else{
            res.send("room already booked");
            res.end();
        }
        
        // console.log(req)
        data={
            student_roll:req.body.roll,
            student_name: req.body.name,
            room_alloted: req.body.room_status,
            room_number: req.body.room,
            hostel:req.body.hostel,
        }
        const result = await student_information.create(data);
        room_available.set( req.body.room, 1);
        console.log("result");
    }
    res.send("success");
})


// ADMIN ROUUTES
app.get('/admin/signin', (req, res) => {
    if (admin_map.get(req.body.id)==req.body.pass) {
        res.send("login done");
    }
    else{
        res.send({message:"failed"});
    }
    res.end();

});

//check carefully 
app.post('/admin/clear_database', async(req, res) => {
    const result = await student_information.deleteMany({});
    res.end();
});

// look at all the ticket/complaint 
app.post('/ticket',async(req,res)=>{
    const result = await student_information.find({});
    console.log(result);
    res.end();
})

app.post('/ticket/resolve',async(req,res)=>{
    const result = await student_information.deleteOne({room_number:req.body.room_num});
    console.log(result);
    res.end();
})


app.listen(port , ()=> console.log("server started at port " + port));




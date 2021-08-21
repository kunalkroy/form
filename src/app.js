require("dotenv").config()
const express = require("express")
const path = require('path');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser =require("cookie-parser")

const app = express();
const port = process.env.PORT || 3000;
require("./db/conn")
const Register = require("./models/registers");
var employee = Register.find({})
const auth = require("./middleware/auth");
app.set("view engine", "ejs");
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
    res.render("form")
})
app.get("/delete-details", (req, res) => {
    res.render("delete-details")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/show", function(req, res,next){    

    employee.exec(function(err,data){
        if(err) throw err;
        res.render("show",{title : "hello and wwelcome ",records:data})
    })  
})
app.post("/delete-details", (req, res) => {
    const del_pera = req.body.dId;
    const deletedata = async (_id)=>{
    try{
    const deletedt = await Register.deleteOne({_id})
    
    res.render("form")
    }catch(e){
        console.log("nhiiiiiiiii huaaaa delete")
    }
   }
    deletedata(del_pera)
   
})


app.post("/reg", async (req, res) => {
    try {
        const passw = req.body.pass;
        const passc = req.body.cpass;
        if (passw === passc) {
            const registerEmployee = new Register({
                firstname: req.body.fstnm,
                middlename: req.body.mnm,
                lastname: req.body.lstnm,
                address: req.body.adrs,
                country: req.body.country,
                state: req.body.state,
                email: req.body.eml,
                zip: req.body.zip,
                dailcode: req.body.dcd,
                height: req.body.hgt,
                weight: req.body.wgt,
                password: req.body.pass,
                confirmpassword: req.body.cpass,
                phone: req.body.phn

            })

            const token = await registerEmployee.generateAuthToken();
            console.log("the token part " + token)

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 80000),
                httpOnly: true
            })

            await registerEmployee.save();
            res.render("form")
        } else {
            res.send("pass un-match")
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

 //login check

app.post("/login", async (req, res) => {
    try {
      
        const email = req.body.leml;
        const pass = req.body.lpss;
        // console.log(email,pass)

        const useremail = await Register.findOne({ email: email });
        console.log(pass,useremail.password)


        const ismatch = await bcrypt.compare(pass, useremail.password);
        console.log(ismatch)
        // console.log(ismatch,useremail)

        const token = await useremail.generateAuthToken();
        console.log("the tokenlogin_part " + token)

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
            // secure:true
        })


        if (ismatch) {
            console.log(ismatch)
            res.render("form")
        } else {
            res.send("pass un-match")
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

app.listen(port, () => {
    console.log(`server is running at port no ${port}!!!!!!!!!!!!`)
})
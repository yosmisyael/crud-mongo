const client = require("mongoose");
const Contact = require("../models/contact");
require("dotenv").config();

client.connect(process.env.DB_URI);

// const contact1 = new Contact({
//   name: "erik",
//   email: "asdf",
//   phoneNum: "230983904",
// });
// contact1.save().then((result) => console.log(result));

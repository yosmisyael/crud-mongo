const client = require("mongoose");

const Contact = new client.model("contact", {
  name: { type: String },
  phoneNum: { type: String },
  email: { type: String },
  createAt: {
    type: String,
    default: new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    }),
  },
  isFav: { type: Boolean, default: false },
});
module.exports = Contact;

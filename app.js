const express = require("express");
const layouts = require("express-ejs-layouts");
const { body, check, validationResult } = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const Contact = require("./models/contact");
require("dotenv").config();
require("./config/db");
const port = process.env.NODE_ENV === "production" ? 3000 : 5000;
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
const app = express();

// flash config
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(layouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).render("home", {
    title: "Contact App",
    layout: "layouts/main",
    data: contacts,
  });
});
app.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  const detailContact = await Contact.findById(id);
  console.log(detailContact);
  res.status(200).render("detail", {
    title: "Contact App - Detail",
    layout: "layouts/main",
    data: detailContact,
  });
});
app.get("/add", (req, res) => {
  res
    .status(200)
    .render("add", { title: "Contact App - Add", layout: "layouts/main" });
});
app.post(
  "/add",
  // [
  //   body("name").custom((value) => {
  //     const isDuplicated = Contact.findOne({ phoneNum: value });
  //     if (isDuplicated) {
  //       throw new Error("Number phone already exist in contact list");
  //     }
  //     return true;
  //   }),
  //   check("email", "Email is not valid!").isEmail(),
  //   check("phoneNum", "Phone number is not valid").isMobilePhone("id-ID"),
  // ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   res.status(400).render("add", {
    //     title: "Contact App - Add",
    //     layout: "layouts/main",
    //     errors: errors.array(),
    //   });
    // } else {
    const { name, email, phoneNum } = req.body;
    if (req.body.isFav) {
      let isFav = true;
      await Contact.insertMany({ name, email, phoneNum, isFav });
      req.flash("msg", "Contact Saved");
      res.redirect("/");
    } else {
      await Contact.insertMany({ name, email, phoneNum });
      // req.flash("msg", "Contact Saved");
      res.status(200).redirect("/");
    }
    // }
  }
);
app.delete("/:id", async (req, res) => {
  await Contact.deleteOne({ _id: req.body._id });
  res.status(200).redirect("/");
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phoneNum, email, isFav } = await Contact.findOne({ _id: id });
  const old_Data = {
    oldName: name,
    oldPhoneNum: phoneNum,
    oldEmail: email,
    oldIsFav: isFav,
    id: id,
  };
  res.status(200).render("update", {
    title: "Contact App - Update",
    data: old_Data,
    layout: "layouts/main",
  });
});

app.put("/", async (req, res) => {
  const { name, email, phoneNum, _id } = req.body;
  if (req.body.isFav) {
    await Contact.updateOne(
      { _id: _id },
      {
        $set: {
          name: name,
          email: email,
          phoneNum: phoneNum,
          isFav: true,
        },
      }
    );
  } else {
    await Contact.updateOne(
      { _id: _id },
      {
        $set: {
          name: name,
          email: email,
          phoneNum: phoneNum,
          isFav: false,
        },
      }
    );
  }
  res.status(200).redirect("/");
});

app.use("/", (req, res) => {
  res
    .status(404)
    .render("not-found", { title: "Requested page/data not found" });
});

app.listen(port, host, () => console.log(`app running on port ${port}`));

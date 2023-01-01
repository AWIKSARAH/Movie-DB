const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const autoIncrement = require("mongoose-auto-increment");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  auth = require("./token-auth")
const dotenv = require('dotenv');
require('dotenv').config();

mongoose.set("strictQuery", false);
//connecct db
mongoose.connect(
  "mongodb+srv://sarah:1351996@cluster0.tbnqxme.mongodb.net/?retryWrites=true&w=majority",
  () => console.log("Connected to MongoDB")
);
app.use(express.json());
app.use(bodyParser.json());
//Schema
autoIncrement.initialize(mongoose.connection);
const schemaJoi = Joi.object({
  name: Joi.string().min(2).required(),
  password: Joi.string().min(8).max(1024).required()
})
const MovieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 4,
  },
});

const movies = mongoose.model("movies", MovieSchema);
MovieSchema.plugin(autoIncrement.plugin, { model: 'movies', field: '_id' });

async function getModelLength() {
  return await movies.countDocuments();
}


const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  }

})

const User = mongoose.model('User', userSchema);

//register --> Create User

app.post("/register", async (req, res) => {

 const username = req.query.name;
 const password = req.query.password;
 const {error} = schemaJoi.validate(req.query);
 
  if(error) {return res.send(error.details[0].message);}
 
  const nameExist= await User.findOne({name:req.query.name})
  if(nameExist)return res.status(400).send("the name is already registered")


const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

  const newUser = new User({
    name: username,
    password: hash
  });
  try{
  const newuser = await newUser.save();
  res.status(201).json(newuser)
  console.log(newuser)
  }
  catch(err){
    res.status(400).json(err)
  }
})

//read users
app.get("/users",auth,async (req, res) => {
  const users = await User.find();
  res.json(users);
})

//update users
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.query;

  const IDExist= await User.findOne({_:req.query.id})
  if(IDExist)return res.status(400).send("the user NOT exist")


if(name && !password){
  try {
    const users = await User.updateOne(
      { _id: id },
      { $set: { name: name } }
    );
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }} 
    if(!name && password){
      try {
        const users = await User.updateOne(
          { _id: id },
          { $set: { password: password } }
        );
        res.json(users);
        console.log(users);
      } catch (err) {
        res.status(500).json(err);
      }
      }

      if(name && password){
        try {
          const users = await User.updateMany(
            { _id: req.params.id },
            { $set: { name: name } },
            { $set: { password: password } }
          );
    
          // movie.rating = req.body.rating;
          res.json(users);
        } catch (err) {
          res.status(500).json(err);
        }}
})

// Delete User 

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.deleteOne({ _id: id });
    res.json(users);}
  
  catch (err) {
    res.status(500).json(err);
  
  }
})

//login
app.post("/login", async (req, res) => {
  const {error} = schemaJoi.validate(req.query);
  if(error) {return res.send(error.details[0].message);}

  const userNameExist= await User.findOne({name:req.query.name})
  if(!userNameExist)return res.status(400).send("Invalid username")

  const passwordExist= await bcrypt.compare(req.query.password, userNameExist.password)
  if(!passwordExist)return res.status(400).send("Invalid password")
// const JWT_SECRET =
const token = jwt.sign({_id:userNameExist.id}, process.env.JWT_SECRET)
res.header('auth-token', token).send(`Welcome ${req.query.name} this is ${token}`)
console.log(res.get('connection'))
  })
  
app.use('/login', auth)
//read All movies routes
app.get("/movies/read", async (req, res) => {
  try {
    const movie = await movies.find();
    res.json(movie);
console.log( await getModelLength())

  } catch (err) {
    console.log(err);
  }
});

//Sort movies by ratingb
app.get("/movies/sort/rating", async (req, res) => {
  try {
    const movie = await movies.find();
    movie.sort((a, b) => b.rating - a.rating);
    res.json(movie);
  } catch (err) {
    console.log(err);
  }
});

//Sort movies by Year
app.get("/movies/sort/year", async (req, res) => {
  try {
    const movie = await movies.find();
    movie.sort((a, b) => b.year - a.year);
    res.json(movie);
  } catch (err) {
    console.log(err);
  }
});

//Sort movies by Title
app.get("/movies/sort/by-title", async (req, res) => {
  try {
    const movie = await movies.find();
    movie.sort((a, b) => b.title - a.title);
    res.json(movie);
  } catch (err) {
    console.log(err);
  }
});

//specific movies routes
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await movies.findById(req.params.id);
    res.json(movie);
  } catch (err) {
    console.log(err);
  }
});

//post /movies
app.post("/movies/add", async (req, res) => {
  //  const years= req.params.year
  //   const rating = req.params.rating
  //   const title = req.params.title

  //   req.body.year = years
  //     req.body.title = title
  //   req.body.rating = rating

console.log( await getModelLength())
  id= await getModelLength();
  
  const movie = new movies({
  _id: id+1,
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
  });
  // console.log("Body"+req.body.title)
  // console.log("param"+req.params.title)
  if (
    !movie.title ||
    !movie.year ||
    isNaN(movie.year) ||
    !/^\d{4}$/.test(movie.year) ||
    movie.rating < 0 ||
    movie.rating > 10
  ) {
    return res.status(400).json({
      message: "Invalid movie",
    });
  } else {
    try {
      const addMovie = await movie.save();
      res.json(addMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});
//delete /movies
app.delete("/movies/delete/:id", async (req, res) => {
  try {
    const movie = await movies.findById(req.params.id);
    await movie.remove();
    res.json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update /movie

app.put("/movies/update/:id", async (req, res) => {
 const title = req.query.title;
 const rating = req.query.rating;
//  req.body.title=title;
//  req.body.rating=rating;
//   console.log(req.body.title);
//   console.log(req.query.title);
if(title && !rating) {
  try {
    const movie = await movies.updateOne(
      { _id: req.params.id },
      { $set: { title: title } }
    );
    // movie.title = req.body.title;
    // movie.year = req.body.year;
    // movie.rating = req.body.rating;
    res.json(movie);
  } catch (err) {
    res.status(500).json(err);
  }}
  if(!title && rating){
    try {
      const movie = await movies.updateOne(
        { _id: req.params.id },
        { $set: { rating: rating } }
      );
      // movie.title = req.body.title;
      // movie.year = req.body.year;
      // movie.rating = req.body.rating;
      res.json(movie);
    } catch (err) {
      res.status(500).json(err);
    }}
    if(title && rating){
      try {
        const movie = await movies.updateMany(
          { _id: req.params.id },
          { $set: { rating: rating } },
          { $set: { title: title } }
        );
        // movie.title = req.body.title;
        // movie.year = req.body.year;
        // movie.rating = req.body.rating;
        res.json(movie);
      } catch (err) {
        res.status(500).json(err);
      }}
      

});
//server
app.listen(port, () => {
  console.log(typeof(port));
  console.log(`listening on port ${port}`);
});

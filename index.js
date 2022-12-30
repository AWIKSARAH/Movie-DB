const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.set("strictQuery", false);
//connecct db
mongoose.connect(
  "mongodb+srv://sarah:1351996@cluster0.tbnqxme.mongodb.net/?retryWrites=true&w=majority",
  () => console.log("Connected to MongoDB")
);
app.use(express.json());
app.use(bodyParser.json());
//Schema

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

//read All movies routes
app.get("/movies/read", async (req, res) => {
  try {
    const movie = await movies.find();
    res.json(movie);
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

  const movie = new movies({
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
  try {
    const movie = await movies.updateOne(
      { _id: req.params.id },
      { $set: { title: req.query.title } }
    );
    // movie.title = req.body.title;
    // movie.year = req.body.year;
    // movie.rating = req.body.rating;
    res.json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});
//server
app.listen(5000, () => {
  console.log("listening on port 3000");
});

const express = require("express");
const app = express();
app.use(express.json());

const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];

//  Create Simple API
app.get("/test", (req, res) => {
  res.json({ status: 200, message: "OK" });
});

//Let's complicate : Time
app.get("/time", (req, res) => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  res.json({ status: 200, message: `${hours}:${minutes}` });
});

//Hello API
app.get("/hello/:id?", (req, res) => {
  const id = req.params.id || "World";
  res.json({ status: 200, message: `Hello, ${id}` });
});

// Search
app.get("/search", (req, res) => {
  const search = req.query.s;
  if (search) {
    res.status(200).json({ status: 200, message: "OK", data: search });
  } else {
    res.status(500).json({
      status: 500,
      error: true,
      message: "You Don't have any things to search",
    });
  }
});


//read
app.get("/movies/read", (req, res) => {
  res.send({
    status: 200,
    message: "this list of movies has been",
    data: movies,
  });

  //Delete
  app.delete("/movies/delete", (req, res) => {
    res.send("This is the delete movies route");
  });

  //Sort By Date
  app.get("/movies/read/by-date", (req, res) => {
    const sortedMovies = movies.sort((a, b) => a.year - b.year);
    res.send({
      status: 200,
      message: "this list of movies Sorted By Date",
      data: sortedMovies,
    });
  });

  //Sort By Rating
  app.get("/movies/read/by-rating", (req, res) => {
    const sortedMoviesByRate = movies.sort((a, b) => a.rating - b.rating);
    res.send({
      status: 200,
      message: "this list of movies Sorted By Rate",
      data: sortedMoviesByRate,
    });
  });

  //Sort By Title
  app.get("/movies/read/by-title", (req, res) => {
    const sortedMoviesByTitle = movies.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    res.send({
      status: 200,
      message: "this list of movies Sorted By Rate",
      data: sortedMoviesByTitle,
    });
  });
});

//Read ONE
app.get("/movies/read/id/:id", (req, res) => {
  const idnum = parseInt(req.params.id); //undefined

  if (idnum-1 <= movies.length) {
    res.status(200).json({ status: 200, message: "OK", data: movies[idnum-1] });
  } else {
    res.status(404).json({
      status: 404,
      error: true,
      message: `the movie ${idnum} does not exist`,
    });
  }
});

// Create a new movie
app.post("/movies/add", (req, res) => {
  const newMovie = {
    title: req.query.title,
    year: parseInt(req.query.year),
    rating: parseInt(req.query.rating) || 4,
  };

  if (
    !newMovie.title ||
    !newMovie.year ||
    isNaN(newMovie.year) ||
    !/^\d{4}$/.test(newMovie.year)
  ) {
    res.status(403).json({
      status: 403,
      message: "you cannot create a movie without providing a title and a year",
    });
  } else {
    movies.push(newMovie);
    res.status(200).json({ status: 200, message: "add successfully" });
    res.send(newMovie);
  }
});

//Delete a movie
app.delete("/movies/delete/:id", (req, res) => {
  const id = req.params.id; //undefined
  //   const deleteMovie = movies.find(movie[id])
  console.log(id);
  if (id <= movies.length && id > 0) {
    movies.splice(movies[id], 1);
    res.status(200).json({ status: 200, message: "delete successfully" });
  } else {
    res.status(404).json({
      status: 404,
      error: true,
      message: "the movie <ID> does not exist",
    });
  }
});

//Update the movie
app.put("/movies/update/:id", (req, res) => {
  const id = parseInt(req.params.id); //undefined
  const titleque = req.query.title;
  const ratingque = req.query.rating;
  //   const updateMovie = movies.find((movie) => movie[id]);
  if (id <= movies.length && id > 0) {
    // if (titleque) movies[req.params.id-1].title = req.query.title
    console.log(titleque);
    console.log(ratingque);
    // if (ratingque) movies[req.params.id-1].rating == req.query.rating
    // 
    if (titleque == undefined){console.log("no title")}else{ movies[id - 1].title = titleque}
    if (ratingque == undefined) {console.log("no rating");}else{movies[id - 1].rating = ratingque}
    res.status(200).json({ status: 200, message: "update successfully" });
  } else {
    res.status(404).json({
      status: 404,
      error: true,
      message: `the movie${id}does not exist`,
    });
  }
});
//Server Port
app.listen(5000, () => {
  console.log("Server listening on port 3000");
});

const express = require("express");
const app = express();

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

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

//create a new search Movies
app.get("/movies/create", (req, res) => {
    res.send("This is the create movies route");
  });

//read
  app.get("/movies/read", (req, res) => {
    res.send({
      status: 200,
      message: "this list of movies has been",
      data: movies,
    });
// Update
app.get("/movies/update", (req, res) => {
    res.send("This is the update movies route");
  });

  //Delete
  app.get("/movies/delete", (req, res) => {
    res.send("This is the delete movies route");
  });

  });
//Server Port
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

const express = require("express");
const app = express();

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
//Server Port
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

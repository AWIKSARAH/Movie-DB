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

  
//Server Port
app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
  
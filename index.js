const express = require("express");
const app = express();

//  Create Simple API
app.get("/test", (req, res) => {
    res.json({ status: 200, message: "OK" });
  });

  
//Server Port
app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
  
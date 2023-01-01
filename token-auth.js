const jwt = require('jsonwebtoken') ;

 module.exports = function authen(req,res) {
    // res.set('Cache-Control', 'public, max-age=3600');

    const token = req.header["auth-token"];
    console.log(token);
    if (!token) return res.status(401).send("ACCESS_DENIED");
try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    

}   
catch(err){
    return res.status(400).send("ACCESS_DENIED"+err);
}

}
//auth-token →eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2IwZDZhY2JjYzgzNDg4MzFhZTgyZjMiLCJpYXQiOjE2NzI1NDI4MjB9.UlWog7s70arThhEbUAZ2oJAygl1VmyrihSGPlyLegEg

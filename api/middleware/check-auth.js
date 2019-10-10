const jwt = require("jsonwebtoken");


module.exports = (req, res, next)=>{
    try{
        
        const decode = jwt.verify(req.headers.token ,"hoangnam97");
        req.userData = decode;
        next();
    }catch(error){
        return res.status(401).json({
            message: "Auth Failed!"
        });
    }
    

    
}
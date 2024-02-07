var jwt = require('jsonwebtoken'); 
const JWT_SECRET= 'NjG';


const fetchuser=(req,res,next)=>{
    //Get the user from the jwt token and add to req object
    const token =req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using valid token"})
    }
    try {
        const data= jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        req.userId=data.user.id;
        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate using valid token"})
    }
   
}


module.exports=fetchuser;
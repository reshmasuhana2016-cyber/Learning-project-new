import jwt from "jsonwebtoken";


const fetchuser = (req, res, next) => {
    try {
        const token = req.header('authToken');
        if(!token) {
            return res.status(401).json({success:false, message: "Access Denied"})
        }
        
    const data = jwt.verify(token, process.env.JWT_SECRET);
     req.user = data.user;
     next()
    }catch(error) {
        res.status(400).json({success:false, message: "Please authenticate using valid token in fetchuser"})
    }
}

export default fetchuser;
import jwt from "jsonwebtoken"
const generateTokenAndSetCookie = (userId,res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:'1d',
    })
    res.cookie("jwt",token,{
        httpOnly:true,
        maxAge:24*60*60*1000,
        sameSite:"strict", //CSRF
    })
    return token;
}
export {generateTokenAndSetCookie}
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const jwt_decode  = require("jwt-decode")

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) =>{
  const cookies = req.cookies;
  console.log(cookies);
  if(!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  // console.log(cookies.jwt);
  const decoded = await jwt_decode(refreshToken);

  const foundUser = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }
  })
  // console.log(foundUser)
  if(!foundUser) return res.sendStatus(403); //Forbidden

  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) =>{
      if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const accessToken = jwt.sign(
        {
          "UserInfo":{
            "username" : decoded.username,
            "email": foundUser.email
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : '1h'}
      );
      res.json({accessToken});
    }
  );
}

module.exports = {handleRefreshToken};
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()


const handleLogin = async(req, res) =>{
  const {eml, pwd } = req.body;
  if(!eml || !pwd) return res.status(400).json({'message': 'Email and password are require.'});

  const foundUser = await prisma.user.findUnique({
    where: {
      email: eml
    }
  })
  if(!foundUser) return res.sendStatus(401); //Unauthorized

  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if(match){
    //create JWTs
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "email": foundUser.email,
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '1h'}
    );
    const refreshToken = jwt.sign(
      {"username": foundUser.username, "email": foundUser.email},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: '5h'}
    );

     //Savings refreshToken with current user
    await prisma.user.update({
      where: { id: foundUser.id },
      data : {
        refreshToken: refreshToken
      }
    })

    res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge : 24 * 60 * 60 * 1000});
    // res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', maxAge : 24 * 60 * 60 * 1000});
    // res.cookie('jwt', refreshToken, { maxAge : 24 * 60 * 60 * 1000});
    res.json({accessToken});
  }else{
    res.sendStatus(401);
  }
}

module.exports = {handleLogin};
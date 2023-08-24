const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const jwt_decode  = require("jwt-decode")

const handleLogout = async(req, res) =>{
  //On client, also delete the accessToken
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(204); 
  const refreshToken = cookies.jwt;
  const decoded = jwt_decode(refreshToken)

  //if refreshToken in db
  const foundUser = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }
  })
  console.log(refreshToken)

  if(!foundUser) {
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true,});
    return res.sendStatus(204);
  }

  //delete refreshToken in db
  await prisma.user.update({
    where: { id: foundUser.id },
    data : {
      refreshToken: ''
    }
  })
  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); //secure: true - only serves on https
  res.sendStatus(204);
}

module.exports = {handleLogout};
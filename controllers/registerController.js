const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) =>{
  const {user, eml, pwd } = req.body;
  if(!user || !pwd || !eml) return res.status(400).json({'message': 'Username, email and password are require.'});

  const findUser = await prisma.user.findUnique({
    where: {
      email: eml
    }
  })
  if(findUser) return res.sendStatus(409);

  try{
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the new user
    const newUser = await prisma.user.create({
      data: {
        "username": user, 
        "email": eml,
        "password": hashedPwd,
        "refreshToken": ''
      }
    })
    console.log(newUser)
    res.status(201).json({'success': `New user ${user} created`});
  }catch(err){
    res.status(500).json({'message': err.message});
  }
}

module.exports = {handleNewUser};
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const jwt_decode  = require("jwt-decode")

const path = require('path')
const { dirname } =require('path')
const appDir = dirname(require.main.filename)

//Get all file
const getAllFiles = async (req,res) => {
  const decoded = await jwt_decode(req.cookies.jwt);
  const foundUserData = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }, 
    include : {
      files : {
        include : {
          tags : true
        }
      }
    }
  })
  // console.log(foundUserData);
  res.json({foundUserData});

}

//Create/upload a file
const createNewFile = async (req, res) => {
  const files = req.files
  const decoded = await jwt_decode(req.cookies.jwt);

  const foundUser = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }
  })
  let filePath = ''
  let fileName = ''

  Object.keys(files).forEach(key =>  {
    filePath = path.join(appDir, 'database', files[key].name)
    fileName = files[key].name
    files[key].mv(filePath, (err) => {
      if(err) return res.status(500).json({status : 'error', message: err})
    })
    
  })
  const createdData = await prisma.file.create({
    data: {
      fileName: fileName, 
      filePath: filePath,
      user: {
        connect: {
          id: foundUser.id
        }
      }
    }
  })

  res.json({status : 'success', createdData })
}

//update file
const updateFile = async (req, res) => {
  const { fileName, tags} = req.body;
  await prisma.file.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      fileName: fileName,
      tags: {
        set: tags
      }
    }
  })

  const foundFile = await prisma.file.findUnique({
    where: {
      id: parseInt(req.params.id)
    },
    include: {
      tags:true
    }
  })
  res.json({status : 'success', foundFile});
}

const removeAllTag = async (req, res) => {
  const { tags } = req.body;
  await prisma.file.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      tags: {
        disconnect: tags
      }
    }
  })
  res.json({status : 'success'}); 
}

//Delete file
const deleteFile = async (req, res) => {
  await prisma.file.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
  res.json({status : 'success', message: `Files deleted`});
}

//Get file
const getFile = async (req,res) => {
  const foundFile = await prisma.file.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
  res.json({foundFile});
}

module.exports = {
  getAllFiles,
  createNewFile,
  updateFile,
  deleteFile,
  getFile,
  removeAllTag
}
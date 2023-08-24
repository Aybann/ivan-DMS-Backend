const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

// Get Tag
const getTag = async (req, res) => {
  const foundTag = await prisma.tag.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
  res.json({foundTag});
}

//Get all Tags
const getAllTag = async (req,res) => {
  const tags = await prisma.tag.findMany()
  res.json({tags});
}

//Create a tag
const createNewTag= async (req, res) => {
  const {name, color} = req.body
  const newTag = await prisma.tag.create({
    data: {
      tagName: name,
      tagColor: color
    }
  })

  res.json({newTag});
}

const updateTag = async (req, res) => {
  const {name, color} = req.body
  await prisma.tag.update({
    where:{
      id: parseInt(req.params.id)
    },
    data: {
      tagName: name,
      tagColor: color
    }
  })
  res.json({status : 'success', message: "File updated"});
}

const deleteTag = async (req, res) => {
  await prisma.tag.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
  res.json({status : 'success', message: "Tag deleted"});
}

module.exports = {
  deleteTag,
  updateTag,
  createNewTag,
  getAllTag,
  getTag
}
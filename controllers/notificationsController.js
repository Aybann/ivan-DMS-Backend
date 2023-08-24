const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const jwt_decode  = require("jwt-decode")

// Get notify
const getNotifications = async (req, res) => {
  const decoded = await jwt_decode(req.cookies.jwt);
  const foundUserData = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }, 
    select : {
      notifications : true
    }
  })
  res.json({foundUserData});
}

const createNotifications = async (req , res) => {
  const {notificationTitle, notificationMessage} = req.body
  const decoded = await jwt_decode(req.cookies.jwt);

  const foundUser = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }
  })

  const newNotifications = await prisma.notification.create({
    data: {
      title: notificationTitle, 
      message: notificationMessage,
      user: {
        connect: {
          id: foundUser.id
        }
      }
    }
  })
  res.json({newNotifications});
}

const deleteNotification = async (req, res) => {
  await prisma.notification.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
  res.json({status : 'success', message: `Notification deleted`});
}


module.exports = {
  deleteNotification,
  createNotifications,
  getNotifications
}
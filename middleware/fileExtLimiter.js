const path = require('path')

const fileExtLimiter = (allowedExtArray) => {
  return (req , res, next) => {
    const files = req.files

    const filesExtensions = []
  
    Object.keys(files).forEach(key => {
      filesExtensions.push(path.extname(files[key].name))
    })

    //Are the files extension allowed?
    const allowed = filesExtensions.every(ext => allowedExtArray.includes(ext))

    if(!allowed) {
      const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", " ,")

      return res.status(422).json({status: "error", message: message})
    }

    next()
  }

}

module.exports = fileExtLimiter
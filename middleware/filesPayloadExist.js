const filesPayloadExists = (req, res, next) => {
  if(!req.files) return res.status(400).json({status:"Error", message: "Missing files"})

  next()
}

module.exports = filesPayloadExists ;
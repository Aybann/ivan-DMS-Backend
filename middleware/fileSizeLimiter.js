const MB = 5 // 5 MB
const FILES_SIZE_LIMIT = MB * 1024 * 1024

const fileSizeLimiter  = (req, res, next) => {
  const files = req.files

  const filesOverLimit = []

  Object.keys(files).forEach(key => {
    if(files[key].size > FILES_SIZE_LIMIT) {
        filesOverLimit.push(files[key].name)
    }
  })

  if(filesOverLimit.length){
    const properVerb = filesOverLimit > 1 ? 'are' : 'is'

    const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the files size limit of ${MB}.`.replaceAll(",",", ")

    const message = filesOverLimit < 3
      ? sentence.replace(",", " and")
      : sentence.replace("/,(?=[^,]*$/", " and")

      return res.status(413).json({status: "error", message: message})
  }

  next()
}

module.exports = fileSizeLimiter ;
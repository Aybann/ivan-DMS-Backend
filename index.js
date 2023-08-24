const express = require('express');
const app = express();
const cors = require('cors');
const corsOption = require('./config/corsOption');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

//Handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resources Sharing
app.use(cors(corsOption));

//build-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/files', require('./routes/api/files'));
app.use('/tags', require('./routes/api/tags'));
app.use('/notifications', require('./routes/api/notifications'));

app.all('*', (req, res) => {
  res.status(404);
  if(req.accepts('json')){
    res.json({ error : "404 Not Found!"});
  }else{
    res.type('txt').send("404 Not Found!");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 

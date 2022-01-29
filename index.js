const {format} = require('util');
const express = require('express');
const expressValidator = require('express-validator')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressValidator())


//Routes
app.use('/users', require('./routes/users.js'));
app.use('/upload', require('./routes/upload.js'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
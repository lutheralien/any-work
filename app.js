const express = require('express')
const env = require('dotenv')
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sql = require('./database/mysql');
const cors = require('cors')
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload')

env.config();
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(methodOverride('_method'));
app.use(fileUpload({ 
}))

sql.connect();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );
  
  app.use(flash());
  
  // Global variables
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

  const usersRoutes = require('./routes/users')
  const homeRoutes = require('./routes/home')

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//homePage
app.use('/',homeRoutes)

//userPage/ dashboard
app.use('/users', usersRoutes)

const port = process.env.PORT 

app.listen(port, () => console.log(`Server running on Port ${port}`))
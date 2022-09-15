const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const mysql = require('mysql');
const uuid = require('uuid');
const fs = require('fs')


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dateStrings: 'date',
    database: process.env.DB_NAME,
  });


    // Database query promises
const zeroParamPromise = (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  };

  const queryParamPromise = (sql, queryParam) => {
    return new Promise((resolve, reject) => {
      db.query(sql, queryParam, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  };

  //User Controllers
  exports.postRegister = async(req, res, next) => {

    const sqlDatetime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');
  
    const { user_name, user_email, password, confirm_password, user_phone } = req.body;
    
    (await db.query('SELECT user_email from users WHERE user_email = ?', [user_email], async (err, results) => {
      if (err) {
          console.log(err);
      }
      if (results.length > 0) {
          return res.render('home/register', {
             message: 'That email is already in use!'
          })
      } else if(password !== confirm_password)
          return res.render('home/register', {
              message: 'The passwords do not Match!'
      })
      let hashedPassword = await bcrypt.hash(password, 8)
      console.log(sqlDatetime);


     (await db.query('INSERT INTO users SET ?', { user_id: uuid.v4(),
          user_name: user_name, 
          user_email: user_email.toLowerCase(), 
          password: hashedPassword, 
          user_phone: user_phone, 
          registration_date:  sqlDatetime, 
       }, (err, results) => {
          if (err) {
              console.log(err)
          }else {
              
              req.flash('success_msg', 'You are now registered and can log in');
              return res.redirect('/users/login');
          } 
      }))

  }))
  }

  exports.getLoginPage = (req, res, next) => {
    res.render('users/login')
  }
  exports.postLoginPage = async (req, res, next) => {
    const { user_email, password } = req.body;
    let errors = [];
    const sql1 = 'SELECT * FROM users WHERE user_email = ?';
    const users = await queryParamPromise(sql1, [user_email]);
    if (
      users.length === 0 ||
      !(await bcrypt.compare(password, users[0].password))
    ) {
      errors.push({ msg: 'Email or Password is Incorrect' });
      res.status(401).render('users/login', { errors });
      } else {
      const token = jwt.sign({ id: users[0].user_id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
     await db.query(`UPDATE users SET last_login = now() WHERE user_id = '${users[0].user_id}'`);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      res.redirect('/users/dashboard');
    }
  }
  //View Dashboard with all information
exports.getUserDashboard = async (req, res, next) => {
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  const user = (await queryParamPromise(sql, [req.user]))[0];
 
  res.render('users/dashboard/dashboard', { user: user });
};
exports.getError403 = (req, res, next) => {
  res.render('users/dashboard/unauthorized')
}
exports.getUpdateUserInformation = (req, res, next) => {
  res.render('users/dashboard/update-user-info')
}
exports.postUpdateInformation = async (req, res, next) => {
  const { user_name, dob, gender, profession, region, town_city, district, address, business_name, user_phone, user_phone_a, groupings } = req.body

sql = 'UPDATE users SET user_name = ?, dob = ?, gender = ?, profession = ?, region = ?, town_city = ?, district = ?, address = ?, business_name = ?, user_phone = ?, user_phone_a = ?, groupings = ? WHERE user_id = ?'

const update = await(queryParamPromise(sql, [ user_name, 
  dob, 
  gender, 
  profession, 
  region,
  town_city, 
  district, address,
business_name, user_phone, user_phone_a, groupings,
req.user ]))
console.log(update);
req.flash('success_msg', 'You have successfully updated your Information!');
return res.redirect('/users/dashboard');
    
}
exports.postUpdateUserProfilePhoto = async (req, res, next) => {
  console.log(req.files);

  if (!req.files)
  return res.status(400).send('No files were uploaded.');

let user_image = req.files.user_image;
let img_name = user_image.name; 
img_name = img_name + uuid.v4()
console.log(img_name);

if(user_image.mimetype == "image/jpeg" ||user_image.mimetype == "image/png"||user_image.mimetype == "image/gif" ){
  
  

  user_image.mv('public/dashboard_public/images/user-images/' + img_name, function(err) {
      if (err)
      return res.status(500).send(err)})
      let errors = [];

      (await db.query('UPDATE users SET profile_image = ? WHERE user_id = ?',[img_name, req.user]))
      req.flash('success_msg', 'Profile Photo Updated Successfully!');          
      res.redirect('/users/dashboard')
        
      } else {
 res.json('image Extension not supported')
  }

}
exports.getPhotoLibrary = async (req, res, next) => {


  res.render('users/dashboard/photo-library')
}

exports.postPhotoLibrary = async (req, res, next) => {

  if (!req.files)
return res.status(401).render('users/dashboard/photo-library', { error_msg: 'No Photo Uploaded!' });

let file = req.files.images
console.log(file.length);
let file_length = file.length

let img_name = '';
userID = req.user
const verify = 'SELECT user_id FROM photo_library WHERE user_id = ?'
const results = (await (queryParamPromise(verify, [req.user])))
console.log(results);
console.log(results.length);



//to verify that the user has uploaded photo b4 and have reached a max of 7 photos
if (results.length >= 7) 
return res.status(401).render('users/dashboard/photo-library', { error_msg: 'Image max upload of 7 exceeded, Go to Update Photo Library to make changes to your Uploaded Photos' });


if (typeof file_length == 'undefined')
return res.status(401).render('users/dashboard/photo-library', { error_msg: 'You Must upload more photos!' });



      

if (file_length > 7)
 return res.status(401).render('users/dashboard/photo-library', { error_msg: 'Images pass the limit ...' });

for(let i = 0; i < file_length; i++){ 
  img_name = file[i].name
  

  if( file[i].mimetype == "image/jpeg" || file[i].mimetype == "image/png" || file[i].mimetype == "image/gif" ){

  file[i].mv('public/dashboard_public/images/photo-library/' + img_name, function(err) {
      if (err)
      return res.status(500).send(err)})
      let errors = [];

      const sql1 = 'SELECT user_id FROM photo_library WHERE user_id = ?'
      const result = (await (queryParamPromise(sql1, [req.user])))
      console.log(result.length);
      
      if (result.length < 7) {
        
        (await db.query('INSERT INTO photo_library SET ? ', {
          image_name: img_name,
          user_id: userID
        }))
      }   
                
  } else{
    return res.status(401).render('users/dashboard/photo-library', { error_msg: 'Image Extension not supported ...' });

  }

 }

req.flash('success_msg', 'Photo Library Got Added Successfully!');
return res.redirect('/users/dashboard');

}

exports.getUpdatePhotoLibrary = async (req, res, next) => {
  const sql = 'SELECT * FROM photo_library WHERE user_id = ?'
const photos = (await (queryParamPromise(sql, [req.user])))

res.render('users/dashboard/photo-library-update', { userData: photos })
}

exports.getUpdatePhotoLibraryWithID = async (req, res, next) => {
  const sql = 'SELECT * FROM photo_library WHERE photo_id = ?'
  const results = (await (queryParamPromise(sql, [req.params.id])))
  console.log(results);
  res.render('users/dashboard/photo-library-edit', { userData: results })
}

exports.postUpdatePhotoLibraryWithID = async (req, res, next) => {
  
  if (!req.files)
  return res.status(400).send('No Image Found!');

let photo = req.files.photo;
let img_name = photo.name;

if(photo.mimetype == "image/jpeg" ||photo.mimetype == "image/png"||photo.mimetype == "image/gif" ){
  
 photo.mv('public/dashboard_public/images/photo-library/'+img_name, function(err) {
      if (err)
      return res.status(500).send(err)})
      let errors = [];
      const sql = 'SELECT * FROM users WHERE user_id = ?';
      const user = (await queryParamPromise(sql, [req.user]))[0];

      const sql1 = 'UPDATE photo_library SET image_name = ? WHERE user_id = ? AND photo_id = ? '
      const results = (await (queryParamPromise(sql1, [img_name, user.user_id, req.params.id])))
      console.log(results);
      req.flash('success_msg', 'Photo updated Successfully!');        
      res.redirect('/users/dashboard')
  
      } else {
 res.json('image Extension not supported')
  }      

}
exports.getDeletePhotoLibraryWithID = async (req, res, next) => {
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  const user = (await queryParamPromise(sql, [req.user]))[0];
  
  sql1= 'DELETE FROM photo_library WHERE photo_id = ? AND user_id = ?';
  (await db.query(sql1, [req.params.id, user.user_id], (err, rows) => {
    if (!err) {
  req.flash('success_msg', 'Photo Deleted From Photo Library!');     
  res.redirect('/users/dashboard');   
}else {
  console.log(err);
}
  }))
}
//Logout Route For Users
exports.getUserLogOut = (req, res, next) => {
  res.cookie('jwt', '', {
     maxAge: 1 
    });
  req.flash('success_msg', 'You are logged out');
  res.status(200).redirect('/users/login');
}
// this is basic code 

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASEDCOURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var payload = req.body;
  var secretKey = "admin123";
  let time = {expiresIn : '1h'};
  let token = jwt.sign(payload, secretKey, time);
  for (var j = 0; j < ADMINS.length; j++) {
    if (payload.username == ADMINS[j].username) {
      return res.status(400).send("username already exists");
    }
  }
  ADMINS.push(payload);
  res.status(200).send({ message: 'Admin created successfully', token: token });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let { username, password } = req.headers;
  for (var j = 0; j < ADMINS.length; j++) {
    if (username == ADMINS[j].username) {
      var payload = {username};
      const secretKey = "admin123";
      let time = {expiresIn : '1h'};
      var token = jwt.sign(payload,secretKey,time);
      res.status(200).send({ message: 'Logged in successfully', token: token })
    }else{
      res.status(401).send("invalid username or password");
    }
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'admin123', (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send('Authorization header not found');
  }
}

let courseId = 0;

app.post('/admin/courses', verifyToken, (req, res) => {
  // logic to create a course
  var {title, description, price, imageLink, published} = req.body;
  var courseExists = false;
  for(var j=0;j<COURSES.length;j++){
    if(title == COURSES[j].title){
      courseExists = true;
      break;
    }
  }
  if(courseExists){
    res.send("course already exists!");
  }else{
    courseId = courseId + 1;
    var course = {courseId, title, description, price, imageLink, published};
    COURSES.push(course);
    res.status(200).send({ message: 'Course created successfully', courseId: courseId });
  }
});

app.put('/admin/courses/:courseId',verifyToken, (req, res) => {
  // logic to edit a course
  var courseId = req.params.courseId;
  var courseExists = false;
  for(var j =0;j<COURSES.length;j++){
    if(courseId == COURSES[j].courseId){
      COURSES[j] = req.body;
      courseExists = true;
      break;
    }
  }
  if(courseExists){
    res.status(200).send({ message: 'Course updated successfully' });
  }else{
    res.status(404).send("no courseId exists");
  }
});

app.get('/admin/courses',verifyToken, (req, res) => {
  // logic to get all courses
  res.status(200).send(COURSES);
});

function verifyToken1(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'user123', (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send('Authorization header not found');
  }
}

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var payload = req.body;
  var secretKey = "user123";
  let time = {expiresIn : '1h'};
  let token = jwt.sign(payload, secretKey, time);
  for (var j = 0; j < USERS.length; j++) {
    if (payload.username == USERS[j].username) {
      return res.status(400).send("username already exists");
    }
  }
  USERS.push(payload);
  res.status(200).send({ message: 'User created successfully', token: token });
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  let { username, password } = req.headers;
  for (var j = 0; j < USERS.length; j++) {
    if (username == USERS[j].username) {
      var payload = {username};
      const secretKey = "user123";
      let time = {expiresIn : '1h'};
      var token = jwt.sign(payload,secretKey,time);
      res.status(200).send({ message: 'Logged in successfully', token: token })
    }else{
      res.status(401).send("invalid username or password");
    }
  }
});

app.get('/users/courses',verifyToken1, (req, res) => {
  // logic to list all courses
  res.status(200).send(COURSES);
});

app.post('/users/courses/:courseId',verifyToken1, (req, res) => {
  // logic to purchase a course
  var courseId = req.params.courseId;
  for(var j=0;j<COURSES.length;j++){
    if(courseId == COURSES[j].courseId){
      PURCHASEDCOURSES.push(COURSES[j]);
      res.status(200).send({ message: 'Course purchased successfully' })
    }
  }
});

app.get('/users/purchasedCourses',verifyToken1, (req, res) => {
  // logic to view purchased courses
  var purchasedCourses = [];
  for(var j=0;j<PURCHASEDCOURSES.length;j++){
    if(req.user.username == PURCHASEDCOURSES[j].username){
      purchasedCourses.push(PURCHASEDCOURSES[j]);
    }
  }
  res.status(200).send(purchasedCourses);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
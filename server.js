import express from "express";
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {
  commentCreateValidator,
  loginValidator,
  postCreateValidator,
  registerValidator,
} from "./validations/auth.js";
import { checkAuth } from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentController.js";
import handleValidationErrors from "./validations/handleValidationErrors.js";


// Mongo connect
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb+srv://kinolov3:WxLTE1xTI8TkX1Kb@blog.wtrdoix.mongodb.net/twitter?retryWrites=true&w=majority"
  ) 
  .then(() => console.log("Mongo is GOOD"))
  .catch((err) => console.log("Mongo is NOT GOOD \n" + err));

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
}) 

const upload = multer({storage: storage}) 

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));


app.use('/uploads', express.static('uploads'))
// Get & Post

// MULTER

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

// USER 
 
app.post("/login", loginValidator, handleValidationErrors, UserController.login);

app.post("/register", registerValidator, handleValidationErrors, UserController.register);

app.get("/me", checkAuth, UserController.getMe);

// POSTS

app.get('/posts', PostController.getAllPosts)

app.get('/tags', PostController.getLastTags)

app.get('/comments', CommentController.getComments)

app.delete('/comments', CommentController.removeComment)

app.get('/posts/tags', PostController.getLastTags)


app.post("/posts", checkAuth, postCreateValidator, handleValidationErrors, PostController.createPost);

app.get('/posts/:id', PostController.getOne)
  
app.post('/posts/:id', checkAuth, commentCreateValidator, handleValidationErrors, CommentController.createComment)

app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.updatePost)
      
app.delete('/posts/:id', checkAuth, PostController.deletePost);


// Server connect

app.listen(process.env.PORT || 3001, (err) => {
  if (err) console.log("Server is NOT GOOD." + err);
  else console.log("Server is GOOD.");
});

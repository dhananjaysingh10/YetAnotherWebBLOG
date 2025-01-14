import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import templateRoutes from './routes/template.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Mongodb connected");
})
.catch(err => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();

app.use(express.json()); // by default can send json to backend, add this to send json res to backend

app.use(cookieParser());

app.listen(3000, ()=>{
    console.log("server started on port 3000");
})

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/comment', commentRoutes);

// after this we gonehave pages of front end
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All fields are required"))
        // return res.status(400).json({message: "All fields are required"});
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        res.json({message: 'signup sucessfull'});
    } catch (error) {
        // res.status(500).json({message: error.message});
        next(error);
    }
    
};

export const signin = async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password || email === '' || password === '') {
        return next(errorHandler(400, "All fields are required"));
    }
    try {
        const vaildUser = await User.findOne({email});
        if(!vaildUser){
            return next(errorHandler(404, 'Email or Password incorrect'));
        }
        const vailPassword = bcryptjs.compareSync(password, vaildUser.password);

        if(!vailPassword){
            return next(errorHandler(404, 'Email or Password incorrect'));
        }
        const token = jwt.sign(
            {
                id: vaildUser._id,
                isAdmin: vaildUser.isAdmin
            },
            process.env.JWT_SECRET,
            // {
            //     expiresIn: '1d'
            // }
        );

        const {password: pass, ...rest} = vaildUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(rest);

    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const {email, name, googlePhotoUrl} = req.body;
    try {
        const user = await User.findOne({email});
        if(user) {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') +
                Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            })
            await newUser.save();
            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
}
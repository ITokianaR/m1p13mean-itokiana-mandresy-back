import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = async (input) => {
    if (!input || !input.email || !input.username || !input.password || !input.fullname) {
        throw new Error("Invalid input data");
    }

    const username = input.username;
    const fullname = input.fullname;
    const email = input.email.toLowerCase();
    const password = input.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username: username,
        fullname: fullname,
        email: email,
        password : hashedPassword,
    });

    return user;
}
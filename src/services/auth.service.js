import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const signUp = async (input) => {
    if (!input || !input.email || !input.username || !input.password || !input.fullname) {
        const error = new Error("Invalid input data");
        error.status = 400;
        throw error;
    }

    const username = input.username;
    const fullname = input.fullname;
    const email = input.email.toLowerCase();
    const password = input.password;
    const role = input.role || 'client';

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        const error = new Error("Email already exists");
        error.status = 409;
        throw error;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        const error = new Error("Username already exists");
        error.status = 409;
        throw error;
    }

    const user = await User.create({
        username: username,
        fullname: fullname,
        email: email,
        password : hashedPassword,
        role : role,
    });

    return user;
}

export const signIn = async (input) => {
    const email = input.email;
    const password = input.password;

    if (!email) {
        const error = new Error("Email can't be blank");
        error.status = 400;
        throw error;
    }

    if (!password) {
        const error = new Error("Password can't be blank");
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error(`User with email: ${email} was not found.`);
        error.status = 404;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.status = 400;
        throw error;
    }

    const token = JWT.sign(
        { id: user._id, role:user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    return {
        token,
        user: user
    };
}
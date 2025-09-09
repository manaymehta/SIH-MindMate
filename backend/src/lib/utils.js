import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        httpOnly: true, // prevents cross site forgery attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax', // prevents cross site scripting attacks
        secure: process.env.NODE_ENV !== 'development',
    });

    return token;
}
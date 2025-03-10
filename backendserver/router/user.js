const express = require('express');
const router = express.Router();
const User = require('../modal/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        console.log(user)
        res.json({ message: 'user created successfully', user });



    }
    catch (err) {
        console.error(err.message);
    }

})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter both email and password' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: 'Please enter correct email' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" })  // ✅ Add RETURN to stop execution
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET ,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false // ✅ Change this to true in production
        });

        return res.status(200).json({ 
            message: 'Logged in successfully', 
            user: { name: user.name } 
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' })
    }
})


router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,  // ✅ Turn off secure (since localhost is HTTP)
            sameSite: 'lax', // ✅ Use 'lax' for local testing
            path: '/'
        });
        return res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;
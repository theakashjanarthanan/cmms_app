// backend\controllers\authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
require('dotenv').config(); // Load environment variables from .env file


// Create Nodemailer transporter using Gmail with App Password from environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Use the email address from .env
        pass: process.env.EMAIL_PASS,  // Use the App Password from .env
    },
});

// Send email function
const sendEmail = (email, fullName, password, role) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // Recipient address
        subject: 'Invitation to Join Our Platform', // Subject line
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 30px; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; width: 100%;">
            <div style="background-color: #ffffff; max-width: 600px; width: 100%; padding: 30px; border-radius: 10px; border: 1px solid grey; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; margin: auto;">
                <p style="font-size: 18px; color: #333; font-weight: bold;">Hello ${fullName},</p>
                <p style="font-size: 16px; color: #333;">Welcome to our platform! You have been successfully added to our system. Below are your account details:</p>

                <div style="border: 2px solid #007BFF; padding: 20px; border-radius: 8px; background-color: #f0f8ff; margin-top: 20px; text-align: left;">
                    <p style="font-size: 16px; color: #333; margin: 0;"><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 16px; color: #333; margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                    <p style="font-size: 16px; color: #333; margin: 5px 0;"><strong>Role:</strong> ${role}</p>
                </div>

                <p style="font-size: 16px; color: #333; margin-top: 20px;">If you need any assistance, feel free to reach out to our support team.</p>
                <p style="font-size: 16px; color: #333;"><strong>Best regards,<br>The Team</strong></p>
            </div>
        </div>
    `,
    };

    transporter.sendMail(mailOptions);
};


// Register User
const registerUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
            dateCreated: new Date(),  // Set dateCreated during registration
        });

        await newUser.save();

        // Send invitation email
        sendEmail(email, fullName,password,role);

        // Respond with success
        res.status(201).json({ message: 'Registration successful. Invitation sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update lastLogin time
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { user: { id: user._id, fullName: user.fullName, role: user.role } },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch Registered Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Delete the User
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the user
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Roles
const assignRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user role
        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getUsers, deleteUser, assignRole };

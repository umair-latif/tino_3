//Authentication routes for Users
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { models } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

//Utility functions for passowrds:
const JWT_SECRET = process.env.JWT_SECRET;
// Generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare a password with its hash
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Register a new user
router.post('/register',
    [
        // Input validation
        body('email').isEmail().withMessage('Invalid email format'),
        body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
        }

        // Password is hashed in beforeCreate in models/user.js
        // Create the user
        const user = await models.User.create({ email, password: password });

        // Generate a JWT token
        const token = generateToken(user.id);
        
        // Return the token and the user (excluding the password)
        res.status(201).json({ token, id: user.id, email: user.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login a user
router.post('/login',
    [
        // Input validation
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        try {
             // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;

            // Find the user
            const user = await models.User.findOne({ where: { email } });
            if (!user) {     
            return res.status(400).json({ error: 'Email: Invalid credentials.' });
            }

            // Compare passwords
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
            return res.status(400).json({ error: `Password: Invalid credentials.`});
            }

            // Generate a JWT token
            const token = generateToken(user.id);

            // Return the token
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Protected route
router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await models.User.findByPk(req.user.userId, {
        attributes: { exclude: ['password'] }, // Exclude password from the response
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error, error.message);
      
    }
});

export default router;
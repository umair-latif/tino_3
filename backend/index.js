//SERVER//
import express from "express";
import config from "./config/config.js";
import cors from "cors";
import {Sequelize} from "sequelize";
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

// Load environment variables
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: console.log, // Enable logging
    }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

const APP = express(); // Aufruf der Hauptfunktion von express

// Middleware
APP.use(cors());
APP.use(express.json());
APP.use(express.static("public"));
APP.use(express.urlencoded({extended: false}));

// Test route
APP.get('/', (req, res) => {
  res.send('Calendar App Backend is running!');
});

// ROUTING:

// Routes
APP.use('/api/auth', authRoutes);
APP.use('/api/events', eventRoutes);

// APP.post("/new", (req, res)=>{
//     console.log(req.body.herofield);

//     heroArr.push(req.body.herofield);
//     res.redirect("/"); //redirect to root
    
// });

// APP.get("/heroes", (req, res)=>{
//     res.send(heroArr);
// });

// Start the server
const IP = "127.0.0.1";
const PORT = process.env.PORT || 5000;
APP.listen(PORT, IP, () => console.log(`Server is running on port: http://${IP}:${PORT}`));
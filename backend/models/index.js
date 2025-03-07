import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import User from './user.js';
import Event from './event.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: console.log, // Enable logging
});


// Initialize models
const UserModel = User(sequelize);
const EventModel = Event(sequelize);

// Set up associations
UserModel.associate({ Event: EventModel });
EventModel.associate({ User: UserModel });

const models = {
  User: UserModel,
  Event: EventModel,
};

export { sequelize, models };
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User, { foreignKey: 'createdBy' });
    }
  }

  Event.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
      },
      allDay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users", // Assuming your users table is named 'Users'
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: 'Event',
    }
  );

  return Event;
};
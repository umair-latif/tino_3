module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "id", {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    });
    await queryInterface.changeColumn("Events", "createdBy", {
      type: Sequelize.STRING,
      allowNull: false,
      references: { model: "Users", key: "id" },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
    await queryInterface.changeColumn("Events", "createdBy", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    });
  },
};

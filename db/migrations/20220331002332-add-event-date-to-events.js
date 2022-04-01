'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Events', 'eventDate', { type: Sequelize.DATEONLY });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Events', 'eventDate');
  }
};

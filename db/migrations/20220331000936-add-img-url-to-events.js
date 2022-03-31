'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Events', 'imgUrl', { type: Sequelize.STRING });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Events', 'imgUrl');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Rsvps', // name of source model
      'EventId', // name of key we are adding
      {
        type: Sequelize.INTEGER,
        references: { // Required field
          model: 'Events',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Rsvps', 'EventId');
  }
};

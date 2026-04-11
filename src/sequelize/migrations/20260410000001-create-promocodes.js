'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('promocodes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Скидка в процентах (1-100)',
      },
      activation_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Максимальное количество активаций',
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Срок действия промокода (null = бессрочный)',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('promocodes')
  },
}

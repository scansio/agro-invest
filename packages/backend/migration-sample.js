module.exports = {
  async up(queryInterface, Sequelize) {
    const date = new Date()
    // Drop and recreate `createdAt` column
    await queryInterface.removeColumn('UserEmailAuthentications', 'createdAt')
    await queryInterface.addColumn('UserEmailAuthentications', 'createdAt', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        timeString: date.toLocaleTimeString(),
        dateString: date.toLocaleDateString(),
        date: date,
        time: date.getTime(),
      }, // Provide a default value if necessary
    })

    // Drop and recreate `updatedAt` column
    await queryInterface.removeColumn('UserEmailAuthentications', 'updatedAt')
    await queryInterface.addColumn('UserEmailAuthentications', 'updatedAt', {
      type: Sequelize.JSON,
      allowNull: true,
    })

    // Repeat for other tables
    await queryInterface.removeColumn('UserEmailNotifications', 'createdAt')
    await queryInterface.addColumn('UserEmailNotifications', 'createdAt', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        timeString: date.toLocaleTimeString(),
        dateString: date.toLocaleDateString(),
        date: date,
        time: date.getTime(),
      },
    })

    await queryInterface.removeColumn('UserEmailNotifications', 'updatedAt')
    await queryInterface.addColumn('UserEmailNotifications', 'updatedAt', {
      type: Sequelize.JSON,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    // Revert changes by dropping the JSON columns and recreating them as timestamps
    await queryInterface.removeColumn('UserEmailAuthentications', 'createdAt')
    await queryInterface.addColumn('UserEmailAuthentications', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    })

    await queryInterface.removeColumn('UserEmailAuthentications', 'updatedAt')
    await queryInterface.addColumn('UserEmailAuthentications', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })

    await queryInterface.removeColumn('UserEmailNotifications', 'createdAt')
    await queryInterface.addColumn('UserEmailNotifications', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    })

    await queryInterface.removeColumn('UserEmailNotifications', 'updatedAt')
    await queryInterface.addColumn('UserEmailNotifications', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  },
}

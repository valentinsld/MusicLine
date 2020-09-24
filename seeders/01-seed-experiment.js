module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Experiments',
      [
        {
          title: 'Blue tree',
          file: 'somefile.png',
          createdAt: new Date('August 19, 2019 23:15:30'),
          updatedAt: new Date('August 19, 2019 23:15:30'),
        },
        {
          title: 'Yellow corner',
          file: 'someotherfile.png',
          createdAt: new Date('August 19, 2019 23:15:30'),
          updatedAt: new Date('August 19, 2019 23:15:30'),
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Experiments', null, {})
  },
}

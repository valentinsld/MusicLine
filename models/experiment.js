module.exports = (sequelize, DataTypes) => {
  const Experiment = sequelize.define(
    'Experiment',
    {
      title: DataTypes.STRING,
      file: DataTypes.STRING,
    },
    {},
  )
  Experiment.associate = function(models) {
    // associations can be defined here
  }
  return Experiment
}

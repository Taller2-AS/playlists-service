module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
  }, {
    tableName: 'videos',
    timestamps: false,
  });

  return Video;
};

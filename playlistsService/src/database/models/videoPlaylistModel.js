module.exports = (sequelize, DataTypes) => {
  const VideoPlaylist = sequelize.define('VideoPlaylist', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    playlistId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoName: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'video_playlists',
    timestamps: false,
  });

  return VideoPlaylist;
};

const { Sequelize, DataTypes } = require('sequelize');
const PlaylistModel = require('./models/playlistModel');
const VideoPlaylistModel = require('./models/videoPlaylistModel');
const { config } = require('dotenv');
config({path: '.env'});
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  logging: false,
});

const Playlists = PlaylistModel(sequelize, DataTypes);
const VideoPlaylists = VideoPlaylistModel(sequelize, DataTypes);

Playlists.hasMany(VideoPlaylists, { foreignKey: 'playlistId' });
VideoPlaylists.belongsTo(Playlists, { foreignKey: 'playlistId' });

module.exports = {
  sequelize,
  Playlists,
  VideoPlaylists,
};

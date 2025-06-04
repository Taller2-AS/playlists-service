const { Sequelize, DataTypes } = require('sequelize');
const PlaylistModel = require('./models/playlistModel');
const VideoPlaylistModel = require('./models/videoPlaylistModel');
const VideoModel = require('./models/videoModel');
const { config } = require('dotenv');
config({path: '.env'});
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  logging: false,
});

const Playlists = PlaylistModel(sequelize, DataTypes);
const VideoPlaylists = VideoPlaylistModel(sequelize, DataTypes);
const Videos = VideoModel(sequelize, DataTypes);

Playlists.hasMany(VideoPlaylists, { foreignKey: 'playlistId' });
VideoPlaylists.belongsTo(Playlists, { foreignKey: 'playlistId' });

Videos.hasMany(VideoPlaylists, { foreignKey: 'videoId' });
VideoPlaylists.belongsTo(Videos, { foreignKey: 'videoId' });
module.exports = {
  sequelize,
  Playlists,
  VideoPlaylists,
  Videos
};

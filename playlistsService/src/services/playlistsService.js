const { Playlists, VideoPlaylists } = require('../database/sequelize');
const catchAsync = require('../utils/catchAsync');
const { getChannel, EXCHANGE_NAME } = require('../queue/config/connection');

const CreatePlaylist = catchAsync(async (call, callback) => {
  const { userId, name } = call.request;
  
  if (!userId){
    return callback(new Error('El usuario debe haber iniciado sesión'));
  }

  if (!name.trim()) {
    return callback(new Error('Faltan campos requeridos'));
  }

  const newPlaylist = await Playlists.create({ userId, name });
  
  /*
  EJEMPLO DE PUBLICACIÓN EN COLA

  const channel = await getChannel();
  channel.publish(
    EXCHANGE_NAME,
    '',
    Buffer.from(JSON.stringify({
      event: 'USER_CREATED',
      videoId: newUser.id.toString(),
      email: newUser.email,
      timestamp: new Date().toISOString()
    }))
  );
  */

  callback(null, {
    id: newPlaylist.id,
    name: newPlaylist.name,
    userId: newPlaylist.userId,
    createdAt: newPlaylist.createdAt.toISOString(),
  });
});

const AddVideoToPlaylist = catchAsync(async (call, callback) => {
  const { userId, playlistId, videoId } = call.request;

  if (!userId){
    return callback(new Error('El usuario debe haber iniciado sesión'));
  }

  if (!playlistId || !videoId) {
    return callback(new Error('Faltan campos requeridos'));
  }

  const playlist = await Playlists.findByPk(playlistId);
  if (!playlist) {
    return callback(new Error('La lista no existe'));
  }

  if (playlist.userId !== userId) {
    return callback(new Error('No tienes permiso para modificar esta lista'));
  }
  await VideoPlaylists.create({ playlistId, videoId });

  callback(null, {
    userId,
    playlistId,
    videoId
  });
});

const GetPlaylistsByUser = catchAsync(async (call, callback) => {
  const { userId } = call.request;

  if (!userId) {
    return callback(new Error('El usuario debe haber iniciado sesión'));
  }

  const playlists = await Playlists.findAll({ where: { userId } });

  const result = {
    playlists: playlists.map(p => ({
      id: p.id,
      name: p.name,
    }))
  };

  callback(null, result);
});

const GetVideosFromPlaylist = catchAsync(async (call, callback) => {
  const { userId, playlistId } = call.request;

  if (!userId) {
    return callback(new Error('El usuario debe haber iniciado sesión'));
  }

  if (!playlistId) {
    return callback(new Error('Faltan campos requeridos'));
  }

  const playlist = await Playlists.findByPk(playlistId);
  if (playlist.userId !== userId) {
    return callback(new Error('No tienes permiso para ver los videos de esta lista'));
  }

  const videos = await VideoPlaylists.findAll({ where: { playlistId } });

  const result = {
    videos: videos.map(v => ({ 
      id: v.videoId,
      name: v.videoName 
    }))
  };

  callback(null, result);
});

const RemoveVideoFromPlaylist = catchAsync(async (call, callback) => {
  const { userId, playlistId, videoId } = call.request;

  if (!userId){
    return callback(new Error('El usuario debe haber iniciado sesión'));
  }

  if (!playlistId || !videoId) {
      return callback(new Error('Faltan campos requeridos'));
  }

  const playlist = await Playlists.findByPk(playlistId);
  if (!playlist) {
    return callback(new Error('La lista de reproducción no existe'));
  }

  if (playlist.userId !== userId) {
    return callback(new Error('No tienes permiso para modificar esta lista'));
  }

  const deleted = await VideoPlaylists.destroy({
      where: { playlistId, videoId }
  });

  if (!deleted) {
    return callback(new Error('El video no se encontró en la lista'));
  }

  callback(null, {});
});

const DeletePlaylist = catchAsync(async (call, callback) => {
  const { userId, playlistId } = call.request;

  if (!userId){
    return callback(new Error('El usuario debe haber iniciado sesión'));
  }

  if (!playlistId) {
    return callback(new Error('Faltan campos requeridos'));
  }

  const playlist = await Playlists.findByPk(playlistId);
  if (playlist.userId !== userId) {
    return callback(new Error('No tienes permiso para eliminar esta lista'));
  }

  await VideoPlaylists.destroy({ where: { playlistId } });
  await Playlists.destroy({ where: { id: playlistId } });

  callback(null, {});
});

const PlaylistsService = {
    CreatePlaylist,
    AddVideoToPlaylist,
    RemoveVideoFromPlaylist,
    GetPlaylistsByUser,
    GetVideosFromPlaylist,
    DeletePlaylist
};

module.exports = PlaylistsService;
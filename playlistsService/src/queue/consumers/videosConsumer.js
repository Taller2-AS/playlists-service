const { getChannel } = require('../config/connection');
const Video = require('../../database/models/videoModel');

const videosConsumer = async () => {
  const channel = await getChannel();

  channel.consume('video-events-queue', async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      if (content.event !== 'VIDEO_CREATED') {

        await Video.create({
            id: content.id,
            name: content.titulo,
        });

        console.log('Video replicado creado:', content.videoId);
      }

      if (content.event !== 'VIDEO_UPDATED') {

        await Video.update(
          {
            id: content.id,
            name: content.titulo,
          },
          {
            where: { id: content.id },
          }
        );

        console.log('Usuario replicado actualizado:', content.videoId);
      }

      if (content.event !== 'VIDEO_DELETED') {

        await Video.update(
          { active: false },
          {
            where: { id: content.id },
          }
        );
        
        console.log('Usuario replicado eliminado:', content.videoId);
      }

      channel.ack(msg);
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error.message);
      channel.nack(msg, false, true);
    }
  });

  console.log('👂 Escuchando mensajes en "video-events-queue"...');
};

module.exports = videosConsumer;
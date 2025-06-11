const { config } = require('dotenv');
config({ path: '.env' });

const { Server, ServerCredentials } = require('@grpc/grpc-js');
const loadProto = require('./src/utils/loadProto');
const PlaylistService = require('./src/services/playlistsService');
const inicializeQueueConsumers = require('./src/queue');
const { sequelize } = require('./src/database/sequelize'); 

config({path: '.env'});

const server = new Server();

sequelize.authenticate()
  .then(async() => {

    await inicializeQueueConsumers();
    console.log('✅ RabbitMQ Consumers inicializados');

    console.log('Conexión a PostgreSQL exitosa');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Tablas sincronizadas correctamente');
  })
  .catch(err => console.error('Error de conexión:', err));

const playlistProto = loadProto('playlist');
server.addService(playlistProto.PlaylistService.service, PlaylistService);

server.bindAsync(`${process.env.SERVER_URL}:${process.env.SERVER_PORT}`, ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error('Error al iniciar el servidor:', error);
        return;
    }
    console.log(`Servidor escuchando en ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`);
});



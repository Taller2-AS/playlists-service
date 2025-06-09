const fs = require('fs');
const path = require('path');
const Video = require('../models/videoModel');

const insertSeedUsers = async () => {
  const seedPath = path.join(__dirname, '..', '..', 'videosSeed.json');
  const usersData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  await Video.deleteMany();
  await Video.insertMany(usersData);
  console.log('Videos semilla insertados correctamente');
};

module.exports = insertSeedUsers;

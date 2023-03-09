//** connessione con l'ipfs **/
const IPFS = require('ipfs-api');

require('dotenv').config();

const ipfs =  new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });

async function accessFolder(folderHash) {  
  
  const file = await ipfs.get(folderHash)
  rnd = getRandomNumber(file.length-1)
  console.log(file[rnd]['content'].toString())
  }

function getRandomNumber(max) {
  return Math.floor(Math.random() * max)+1;
}

accessFolder(process.env.COMMON);
/*rarity:         0.1   0.2  0.3   0.4   0.5  
    common: 0      70%  48%  20%    0%    0%
    uncommon: 1   21.5% 30%  38%   27%    10%
    rare: 2         8%  15%  29%   40%    25%
    epic: 3       0.5%   7%  10%   25%    47%
    ultra: 4        0    0   2.4%   6%    13%
    legendary: 5    0    0   0.6%   2%     5%

    uniforme: 16,66%
*/
require('dotenv').config();
const IPFS = require('ipfs-api');

const ipfs =  new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });

getRandomElement( process.env.VALUE_ETH_1)

async function getRandomElement(value) {
  console.log(value);
    //value = 1
    const randomNum = Math.random() * 100;
    console.log(randomNum);
    if(value == process.env.VALUE_ETH_1){
          res = await accessFolder("QmXF6xqfyfyxCsnHHxKhwvJsBeMzq9BmJy32SR937iqLY5");
          console.log(res);
          return res      
    }    
}

async function accessFolder(folderHash) {  
  const file = await ipfs.ls(folderHash)
  const pinnati = []
  for (const entry of file) {
    try{
        const pinStatus = await ipfs.pin.ls(entry.hash)
    if (pinStatus) {
      pinnati.push(entry)
    }
    }catch(err){
        pinStatus=null;
    } 
  }
  if ( pinnati.length > 0) {
    rnd =  getRandomNumber(pinnati.length)-1
    console.log(pinnati.length);
  }else{
    return "I json sono finiti!"
  }
  console.log(pinnati[0]);
  const exstracted = await ipfs.get(pinnati[rnd]['path'])  
  await ipfs.pin.rm(pinnati[rnd]['path']) 
  console.log('File pinnati all\'interno della cartella:')
  console.log(pinnati);
  return {
      path: pinnati[rnd]['hash'].toString(),
      content: exstracted[0]['content'].toString()
    }
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max)+1;
}


module.exports = {getRandomElement};
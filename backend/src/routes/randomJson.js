//** gestione dell' estrazione dei token presenti nell'ipfs **/

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

/** funzione per l'estrazione di un token **/
async function getRandomElement(value) {
    const randomNum = Math.random() * 100;
    if(value == process.env.VALUE_ETH_1){
      switch (true) {
        case randomNum <= 70:
          res = await accessFolder(process.env.COMMON);
          return res
        case randomNum > 70 && randomNum <= 91.5: 
         res =await accessFolder(process.env.UNCOMMON);
          return res
        case randomNum > 91.5 && randomNum <=99.5 :
          res =await accessFolder(process.env.RARE);
          return res
        case randomNum > 99.5 && randomNum <= 100:
          res = await accessFolder(process.env.EPIC);
          return res
        default:
          return 0;
      }
    }else if(value == process.env.VALUE_ETH_2){
      switch (true) {
        case randomNum <= 48:
          res = await accessFolder(process.env.COMMON);
          return res
        case randomNum > 48 && randomNum <= 78: 
         res =await accessFolder(process.env.UNCOMMON);
          return res
        case randomNum > 78 && randomNum <=93 :
          res =await accessFolder(process.env.RARE);
          return res
        case randomNum > 93 && randomNum <= 100:
          res = await accessFolder(process.env.EPIC);
          return res
        default:
          return 0;
      }
    }else if(value == process.env.VALUE_ETH_3){
      switch (true) {
        case randomNum <= 20:
          res = await accessFolder(process.env.COMMON);
          return res
        case randomNum > 20 && randomNum <= 58: 
         res =await accessFolder(process.env.UNCOMMON);
          return res
        case randomNum > 58 && randomNum <=87 :
          res =await accessFolder(process.env.RARE);
          return res
        case randomNum > 87 && randomNum <= 97:
          res = await accessFolder(process.env.EPIC);
          return res
        case randomNum > 97 && randomNum <= 99.4:
            res = await accessFolder(process.env.ULTRA);
            return res
        case randomNum > 99.4 && randomNum <= 100:
          res = await accessFolder(process.env.LEGENDARY);
          return res
        default:
          return 0;
      }
    }else if(value == process.env.VALUE_ETH_4){
      switch (true) {
        case randomNum <= 27:
          res = await accessFolder(process.env.UNCOMMON);
          return res
        case randomNum > 27 && randomNum <= 67: 
         res =await accessFolder(process.env.RARE);
          return res
        case randomNum > 67 && randomNum <= 92 :
          res =await accessFolder(process.env.EPIC);
          return res
        case randomNum > 92 && randomNum <= 98:
          res = await accessFolder(process.env.ULTRA);
          return res
        case randomNum > 98 && randomNum <= 100:
          res = await accessFolder(process.env.LEGENDARY);
          return res
        default:
          return 0;
      }
    }else if(value == process.env.VALUE_ETH_5){
      switch (true) {
        case randomNum <= 10:
          res = await accessFolder(process.env.UNCOMMON);
          return res
        case randomNum > 10 && randomNum <= 35: 
         res =await accessFolder(process.env.RARE);
          return res
        case randomNum > 35 && randomNum <= 82 :
          res =await accessFolder(process.env.EPIC);
          return res
        case randomNum > 82 && randomNum <= 95:
          res = await accessFolder(process.env.ULTRA);
          return res
        case randomNum > 95 && randomNum <= 100:
          res = await accessFolder(process.env.LEGENDARY);
          return res
        default:
          return 0;
      }
    }
    
}

//** funzione per accedere ad una cartella ipfs e restituire un file randomico pinnato **/
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
  }else{
    return "I json sono finiti!"
  }
  const exstracted = await ipfs.get(pinnati[rnd]['path'])  
  await ipfs.pin.rm(pinnati[rnd]['path']) 
  console.log('File pinnati all\'interno della cartella:')
  console.log(pinnati);
  return {
      path: pinnati[rnd]['hash'].toString(),
      content: exstracted[0]['content'].toString()
    }
}


/**  
 * --------------------funzione per prendere json non pinnati, quindi con possibilita di riuscire gli stessi nft--------------------
  async function accessFolder(folderHash) {    
  
    const file = await ipfs.get(folderHash)
    rnd =  getRandomNumber(file.length-1)
    return {
      path: file[rnd]['path'].toString(),
      content: file[rnd]['content'].toString()
    }
    }
*/

//** funzione per la generazione di un numero casuale **/
function getRandomNumber(max) {
  return Math.floor(Math.random() * max)+1;
}


module.exports = {getRandomElement};
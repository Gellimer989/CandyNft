const experess = require('express');
const app = experess();
const cors = require('cors');
const database = require('../../database/database_connection');
const User = require('../../database/model/User');
const ethjs = require('ethereumjs-util');
const jwt = require('../configuration/jwt');
const jsonController = require('./randomJson');
const { Op } = require('sequelize');
require('dotenv').config();

app.use(cors());
app.use(experess.json());

database.sync({}).then(console.log("Database Synced"));

var account;


function signedAddress(user, signature){
    try{ 
        const msg = Buffer.from(`I am signing my one-time nonce: ${user.nonce}`);
        const msgBuffer = ethjs.toBuffer(msg);
        const msgHash = ethjs.hashPersonalMessage(msgBuffer);
        const signatureBuffer = ethjs.toBuffer(signature);
        const signatureParams = ethjs.fromRpcSig(signatureBuffer);
        const pubKey = ethjs.ecrecover(
            msgHash, 
            signatureParams.v, 
            signatureParams.r,
            signatureParams.s
        );
        const addressBuffer = ethjs.pubToAddress(pubKey);
        return ethjs.bufferToHex(addressBuffer);
    }catch(err){
        console.log(err);
        return err;
    }
}

//** chiamata per controllare la validita el token **/
app.post("/check-token",async(req,res) =>{
    checkToken = jwt.verifyToken(req,res);
    if(checkToken['publicAddress'] == req.body.user){
        res.status(200).json({"message":"token verified successfully"})
    }else{
        res.status(401).json({"error": "token not verified"})
        
    }
})


//**  chiamata per l'estrazione dei token contetnuti nel server ipfs **/
app.post("/nftJson", async (req, res) => { 
    checkToken = jwt.verifyToken(req,res);
    selectedValue = req.body.value;
    if(checkToken['publicAddress'] == req.body.account){
        const nftJson = await jsonController.getRandomElement(selectedValue);
        if(nftJson){
            res.status(200).json((nftJson))
        }else{
            res.status(403).json({"error": "not enought json"})
        }        
    }else{
        return res.status(401).json({"message":"Token verification failed"});
    }
})


//** chiamata che restituisce tutti gli indirizzi degli account salvati nel database **/
app.post("/public-accounts", async (req, res) =>{
    account = req.body.account;
    //restituisce tutti gli utenti nel database eccetto l'utente loggato
    await User.findAll({
        attributes:['publicAddress'],
        where: {
        publicAddress: {
          [Op.ne]: account
        }
      }}).then((risultati) => {
        res.json(risultati);
      }).catch((errore) => {
        res.status(500).json({ error: errore });
      });
})


//** chiamata per restituire il nonce salvato nel database**/
app.post('/nonce', async (req, res) => {
    try{
        account = req.body.account;
        if(account === undefined){
            return res.status(403).json({"message":"Account not found"});
        }
        const user =await User.findOne({where:{publicAddress:account}})
        if (!user && user !== null){
            await User.create({publicAddress:account}).then((user)=>{
                res.json(user.nonce);
            });
        }else{
            res.json(user.nonce);
        }
    }catch(err){
        return res.status(401).json({"message":"Token verification failed"});
    }
  });


//** chiamata per l' autenticazione dell'utente tramite firma e retituisce il jwt **/
app.post('/auth', async (req, res) => {
    account = req.body.account;
    signature = req.body.signature;
    if (account!= undefined && signature!= undefined) {
    try{
        await User.findOne({where:{publicAddress:account}})
        .then(user => { 
            const add = signedAddress(user,signature);
            if(add.toLowerCase() === account.toLowerCase()){
                const token = jwt.createToken(user);
                if (token){
                    res.status(200).json({
                        success: true,
                        token: 'Bearer ' + token,
                        user: user,
                        msg: 'Authentication successful'
                    });
                    return user;
                }else{
                return res.status(401).json({"message":"Token creation failed"});
                }
            }else{
                return res.status(401).json({"message":"SIgnature verification failed"});
            } 
        }).then(user => {
            user.nonce = Math.floor(Math.random() * 1000000);
            return user.save();
        })
    }catch(err){
        return res.status(401).json({"message":"Account or Signature verification failed"});
    }
    }else{
        return res.status(401).json({"message":"Authentication failed"});
  
    }
  });


app.listen(process.env.PORT || 3002, () => {
    console.log('listening on port '+ (process.env.PORT || 3001));
});
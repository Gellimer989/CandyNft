//** gestione del jwt **/

const jwt = require('jsonwebtoken');

require('dotenv').config();

/** creazione jwt **/
function createToken(user){
    return jwt.sign({
        _id: user._id,
        publicAddress: user.publicAddress,
    }, process.env.JWT_SECRET, {expiresIn: '1h'});
}

//** funzione verifica del jwt**/
function verifyToken(req, res){
    const token = req.headers.authorization;
    const parsedToken = token.split("Bearer ")[1]
    
    var result = 0;
    if(parsedToken){
        result = jwt.verify(parsedToken, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
               res.sendStatus(401).json({"message":"Unauthorized"});
            }else{
                return (decoded)
            }
        });
    }else{ 
        res.sendStatus(404).json({"message":"token not found"});;
    }
    return result;
}

module.exports = {createToken , verifyToken};
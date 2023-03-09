var Nft = artifacts.require("./MyNft.sol");

contract("Nft",function(accounts){
    var nftInstance;

    it("test create token", function(){
        return Nft.deployed().then(function(instance){
            return instance.createToken("Juve11","image","2","object","epic", {from : accounts[0]});
        }).then(function(tokenId){
            console.log(JSON.stringify(tokenId));
            assert.equal(tokenId["logs"][0]["args"]["tokenId"],1,"tokenId is one");
        });
    });

    it("test create token", function(){
        return Nft.deployed().then(function(instance){
            return instance.createToken("Juve11","image","2","object","epic", {from : accounts[0]});
        }).then(function(tokenId){
            console.log(JSON.stringify(tokenId));
            assert.equal(tokenId["logs"][0]["args"]["tokenId"],1,"tokenId is one");
        });
    });

    it("test create token", function(){
        return Nft.deployed().then(function(instance){
            return instance.createToken("Juve11","image","2","object","epic", {from : accounts[0]});
        }).then(function(tokenId){
            console.log(JSON.stringify(tokenId));
            assert.equal(tokenId["logs"][0]["args"]["tokenId"],2,"tokenId is one");
        });
    });

    it("test number token", function(){
        return Nft.deployed().then(function(instance){
            return instance.tokens(1);
        }).then(function(token){
            assert.equal(token[0],"Juve11");
            assert.equal(token[1],"image");
            assert.equal(token[2],"2");
            assert.equal(token[3],"object");
            assert.equal(token[4],"epic");
        });
    });
});

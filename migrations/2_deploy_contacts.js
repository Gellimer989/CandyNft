const Contacts = artifacts.require("./MyNft.sol");

module.exports = function(deployer) {
  deployer.deploy(Contacts);
};
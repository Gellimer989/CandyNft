pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract MyNft is ERC721URIStorage{
    //address private owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    bool mutex = false;

    constructor() ERC721("CandyNft", "CNT") payable{
    }
    
    function createToken(string memory uri, address user) public payable returns (uint256){
      assert(user == msg.sender);
      require(user != address(0), "Empty to adress");
      require(msg.sender.balance >= msg.value);

      require(msg.value > 0 ,"value must be greater than 0 ");

      //incementazione id  con Counter di OpenZeppelin
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      //creazione Token e assegnazione dell Uri
      _mint(user, newTokenId);
      _setTokenURI(newTokenId, uri);
      return newTokenId;
    }

    function getBalance(address user)private view returns (uint256){
      uint256 balance = balanceOf(user);
      return balance;
    }

    function getTokens()private view returns (uint256){
      uint256 tokens =_tokenIds.current();
      return tokens;
    }

    function getTokenIdsByOwner(address owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = getBalance(owner);
        uint256 tokenCount = getTokens();
        uint256[] memory ids = new uint256[](ownerTokenCount);
        uint256 currentIndex = 0; 
        
        for (uint256 i = 1; i <= tokenCount; i++) {
            if (ownerOf(i) == owner) {
                ids[currentIndex] = i;
                currentIndex++;
            }
        }
        return ids;
    }

    function transferToken(address to, address from , uint256 tokenId) public {
      require(!mutex);

      require(to != address(0), "Empty to adress");
      require(from != address(0), "Empty from adress");
      require(ownerOf(tokenId) == from, "Wrong from address");
      require(msg.sender == from);

      //mutex per evitare attacchi di rientro
      mutex= true;
      _transfer(from, to, tokenId);
      mutex= false;
    }
}
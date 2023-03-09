// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract MyToken is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public owner;
    mapping (uint256 => Token) public tokens;
    event NFTMinted(uint256);
    mapping (address => uint[]) public tokensOfOwner;

    struct Token {
        string name;
        string image;
        string value;
        string tipology;
        string rarity;
    }
    
    constructor() ERC721("MyToken", "MTK") payable{
        owner = payable(msg.sender);
     }

    function createToken(string memory _name, string memory _image, string memory _value, string memory _tipology, string memory _rarity) public payable returns (uint256){
        require(msg.value >= 0,"value must be >= 0");
        //require(msg.sender == owner,"falses");
        _tokenIds.increment(); //genera id
        tokens[_tokenIds.current()] = Token(_name, _image, _value,_tipology,_rarity);
        string memory tokenUri = getTokenURI(_tokenIds.current());
        uint256 newTokenId = createNft(msg.sender, tokenUri);
        return newTokenId;
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        Token storage token = tokens[_tokenId];
        bytes memory tokenInfo = abi.encodePacked(token.name, token.image, token.value,token.tipology,token.rarity);
        string memory tokeID = Strings.toString(_tokenId);
        bytes memory encoded = abi.encodePacked(Strings.toHexString(address(this)), "/token/",tokeID , "/" ,bytesToString(tokenInfo));
        string memory tokenUri = bytesToString(encoded);
        return tokenUri;
    }

    function bytesToString(bytes memory _b) internal pure returns (string memory) {
        bytes memory dynamicBytes = new bytes(_b.length);
        for (uint256 i = 0; i < _b.length; i++) {
            dynamicBytes[i] = _b[i];
        }
        
        return string(dynamicBytes);
    }


    function createNft(address user, string memory tokenUri) public returns (uint256){
        //_tokenIds.increment(); //genera id
        uint256 newItemId = _tokenIds.current();
        _mint(user,newItemId);
        _setTokenURI(newItemId,tokenUri);
        require(_isApprovedOrOwner(msg.sender, newItemId), "Il token non appartiene al mittente");
        safeTransferFrom(msg.sender, user, newItemId);
        return newItemId;
    }

    function tokenURI12(uint256 tokenId) public view returns (string memory) {
        // restituisce l'URL delle informazioni del token
        return tokenURI(tokenId);
        
    }

    //event Transfer(address from, address to, uint256 tokenId);

    
}

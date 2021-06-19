pragma solidity ^0.8.1;

import "openzeppelin-contracts/math/Safemath.sol";

contract  Room   {
    using SafeMath for uint256;

    string public name;
    string public url;
    string public imageURL;
    string public description;
    uint256 public roomPrice;
    address payable public beneficiary;
    address payable public booker;
    uint256 public roomState; 
    

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _description,
        uint256 _roomPrice,
        address payable _beneficiary
    )
        public payable
    {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _description;
        roomPrice = _roomPrice;
        beneficiary = _beneficiary;
        roomState = 1;
    }

    
    function getRoomState() public view returns(uint256) {
        return roomState;
    }
    
    function payRoom() public payable {
        
        uint256 payRoom = msg.value;
        if (roomState == 1 && msg.sender != beneficiary ){
            booker = payable(msg.sender);
            beneficiary.send(payRoom);
            roomState = 0;
        }
        else{
            payable(msg.sender).send(payRoom); 
        }
        
    }


}

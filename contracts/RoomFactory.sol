pragma solidity ^0.8.1;

import "./Room.sol";

contract RoomFactory {
   uint256 constant maxLimit = 20;
   Room[] public rooms;

    function createRoom(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory description,
        uint256 roomPrice
        
    )
        public
    {
        Room room = new Room(
            name,
            url,
            imageURL,
            description,
            roomPrice,
            payable(msg.sender)
        );
        rooms.push(room);
    }

    function roomsCount() public view returns(uint256) {
        return rooms.length;
    }

   
    function getRooms() public  returns(Room[] memory)
    {
        return rooms;
    }
}

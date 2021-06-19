const RoomFactoryContract = artifacts.require("RoomFactory");

module.exports = function(deployer) {
  deployer.deploy(RoomFactoryContract);
}

import React, { useState, useEffect, Component } from "react";
import { makeStyles } from '@material-ui/core/styles';
import RoomCard from './RoomCard'
import getWeb3 from "./utils/getWeb3";
import RoomContract from "./contracts/RoomFactory.json";
import Web3 from 'web3'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));


const Home = () => {
  const [ contract, setContract] = useState(null)
  const [ accounts, setAccounts ] = useState(null)
  const [ rooms, setRooms ] = useState([])
  
  useEffect(() => {
    
    init()
  }, []);

  const init = async () => {
    try {
      
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RoomContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        RoomContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      setAccounts(accounts)
      setContract(instance)
      const rooms = await instance.methods.getRooms().call()
      setRooms(rooms)

    }
    catch(error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.home`,
      );
      console.error(error);
    }
  }

  const displayRooms = () => {
    return rooms.map((roomCard) => {
      return (
        <RoomCard
          roomCard={roomCard}
          accounts = {accounts}
          key={roomCard}
          />
      )
    })
  }

  return (
    <div className="main-container">
      {displayRooms()}
    </div>
  )
}

export default Home;

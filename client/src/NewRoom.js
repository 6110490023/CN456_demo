
import React, { useState, useEffect } from "react";
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import getWeb3 from "./utils/getWeb3";
import FactoryContract from "./contracts/RoomFactory.json";
import Web3 from 'web3'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
}));

const NewRoom = () => {
const [labelWidth, setLabelWidth] = React.useState(0);
const labelRef = React.useRef(null);
const classes = useStyles();
const [ web3, setWeb3 ] = useState(null)

useEffect(() => {
  const init = async() => {
    try {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FactoryContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setWeb3(web3)
      setContract(instance)
      setAccounts(accounts)
    } catch(error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  init();
}, []);

const [ name, setRoomName ] = useState(null)
const [ website, setRoomWebsite ] = useState(null)
const [ description, setRoomDescription ] = useState(null)
const [ image, setImage ] = useState(null)
const [ address, setAddress ] = useState(null)
const [ contract, setContract] = useState(null)
const [ accounts, setAccounts ] = useState(null)
const [ roomPrice, setRoomPrice] = useState(null)

const handleSubmit = async () => {
  const imageURL = image
  const url = website
  const Price =  roomPrice

  const transaction = await contract.methods.createRoom(
    name,
    url,
    imageURL,
    description,
    Price,
  ).send({ from: accounts[0] })

  alert('Successfully created room')
}

  return (
    <div className="create-room-container">
      <h2>Create A New Room</h2>

      <label>Name</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Room Name"
        margin="normal"
        onChange={(e) => setRoomName(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Website</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Room Website"
        margin="normal"
        onChange={(e) => setRoomWebsite(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Description</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Room Description"
        margin="normal"
        onChange={(e) => setRoomDescription(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>Image</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Room Image"
        margin="normal"
        onChange={(e) => setImage(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />

      <label>roomPrice</label>
      <TextField
        id="outlined-bare"
        className={classes.textField}
        placeholder="Enter roomprice"
        margin="normal"
        onChange={(e) => setRoomPrice(e.target.value)}
        variant="outlined"
        inputProps={{ 'aria-label': 'bare' }}
      />

      <Button
        onClick={handleSubmit}
        variant="contained"
        className={classes.button}>
        Submit
      </Button>
    </div>
  )
}


export default NewRoom;

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import getWeb3 from "./utils/getWeb3";
import RoomContract from "./contracts/Room.json";
import Web3 from 'web3'

import { Link } from 'react-router-dom'

const cc = require('cryptocompare')

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top,
    left,
  };
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    display: 'table-cell'
  },
  card: {
    maxWidth: 450,
    height: 400
  },
  media: {
    height: 140,
  },
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: 'none',
    padding: 4,
  },
}));

const RoomCard = (props) => {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

  const [contract, setContract] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [room, setRoom] = useState(null)
  const [roomName, setRoomname] = useState(null)
  const [description, setDescription] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [url, setURL] = useState(null)
  const [open, setOpen] = React.useState(false);
  const [exchangeRate, setExchangeRate] = useState(null)
  const [roomPrice, setRoomPrice] = useState(null)
  const [roomState, setRoomState] = useState(null)
  const [booker, setBooker] = useState(null)
  const [owner, setOwner] = useState(null)

  const ethAmount = (roomPrice / exchangeRate || 0).toFixed(4)
  const { roomCard } = props
  const classes = useStyles();

  useEffect(() => {
    if (roomCard) {
      init(roomCard)
    }
  }, [roomCard]);

  const init = async (roomCard) => {
    try {

      const h = 5;
      const room = roomCard
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RoomContract.networks[networkId];
      const accounts = props.accounts
      const instance = new web3.eth.Contract(
        RoomContract.abi,
        room
      );
      setContract(instance)
      setAccounts(accounts)
      setRoom(room)
      const name = await instance.methods.name().call()
      const description = await instance.methods.description().call()
      const imageURL = await instance.methods.imageURL().call()
      const url = await instance.methods.url().call()
      const roomPrice = await instance.methods.roomPrice().call()
      const roomState = await instance.methods.roomState().call()
      const owner = await instance.methods.beneficiary().call()
      const booker = await instance.methods.booker().call()
      const exchangeRate = await cc.price('ETH', ['USD'])

      setExchangeRate(exchangeRate.USD)
      setRoomname(name)
      setDescription(description)
      setImageURL(imageURL)
      setURL(url)
      setRoomPrice(roomPrice)
      setRoomState(roomState)
      setOwner(owner)
      setBooker(booker)

    }
    catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details. card`,
      );
      console.error(error);
    }
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload()
  })

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitRooms = async () => {
    const ethRate = exchangeRate
    const ethTotal = roomPrice / ethRate
    console.log(ethTotal)
    const donation = web3.utils.toWei(ethTotal.toString())
    const a = await contract.methods.payRoom().send({
      from: accounts[0],
      value: donation,
      gas: 650000
    })
    const roomState = await contract.methods.getRoomState().call({ from: accounts[0], })
    setRoomState(roomState)
    setOpen(false);
    window.location.reload()
  }

  return (
    <div className="room-card-container">
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {roomName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <img src={imageURL} width='200px' height='200px' />
            <p>{description}</p>

            <div className="donation-input-container">
              <p>Room Price: {roomPrice}</p>

              <p>	&nbsp;	&nbsp; Eth: {ethAmount}</p>
              
            </div>
            <p id = {roomState == 1 ? "Available":"NotAvailable"}> 
              Status : {roomState == 1 ? "Available":"Not Available" } </p>
            
                <div>
                  <p> Owner : {owner} </p>
                  </div>
              {(roomState == 0 && (owner == accounts[0] || booker == accounts[0])) &&
                <div>
                  <p> Booker : {booker} </p>
                </div>
              }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(roomState == 1 && owner != accounts[0]) &&
            <div>

              <Button onClick={submitRooms} variant="contained" color="primary">
                Pay
              </Button>
            </div>
          }
          <Button onClick={handleClose} variant="contained" color="primary">
                Cancel
          </Button>

        </DialogActions>
      </Dialog>

      <Card className={classes.card} onClick={handleOpen}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={imageURL}
            title="Room Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {roomName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <p>{description}</p>
              <p> Room Price : ${roomPrice}</p>
              <p id = {roomState == 1 ? "Available":"NotAvailable"}> 
              Status : {roomState == 1 ? "Available":"Not Available" } </p>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            onClick={handleOpen}
            variant="contained"
            className={classes.button}>
            View More
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default RoomCard;

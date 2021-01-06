import React from "react";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";

export default class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.postPayment = this.postPayment.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleWho = this.handleWho.bind(this);
    this.handleWhat = this.handleWhat.bind(this);
  }

  price = 0;
  who;
  what;

  handleClickOpen() {
    this.setState({ isOpen: true });
  }
  handleClose() {
    this.setState({ isOpen: false });
  }
  handlePrice(event) {
    this.price = event.target.value;
  }
  handleWho(event) {
    this.who = event.target.value;
  }
  handleWhat(event) {
    this.what = event.target.value;
  }
  postPayment() {
    const params = new URLSearchParams();
    const price = this.price;
    const userId = this.who;
    const what = this.what;
    params.append("price", price);
    params.append("userId", userId);
    params.append("what", what);
    axios.post("http://localhost:8080/payment", params).then((res) => {
      console.log("price, userId");
    });
    this.handleClose();
  }

  render() {
    return (
      <div>
        <IconButton aria-label="add" onClick={this.handleClickOpen}>
          <AddIcon />
        </IconButton>
        <Dialog open={this.state.isOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add payment</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" id="price" ref={(price) => (this.price = price)} label="price" type="text" onChange={this.handlePrice} fullWidth />
            <FormControl fullWidth>
              <InputLabel>who</InputLabel>
              <Select onChange={this.handleWho}>
                {this.props.users.map((user, index) => (
                  <MenuItem key={index} value={user.ID}>
                    {user.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField margin="dense" id="what" ref={(what) => (this.what = what)} label="what" type="text" onChange={this.handleWhat} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.postPayment} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

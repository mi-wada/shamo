import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";

export default class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClickOpen() {
    this.setState({ isOpen: true });
  }
  handleClose() {
    this.setState({ isOpen: false });
  }
  render() {
    return (
      <div>
        <IconButton aria-label="check" onClick={this.handleClickOpen}>
          <CheckIcon />
        </IconButton>
        <Dialog open={this.state.isOpen} onClose={this.handleClose}>
          <DialogContent>peni</DialogContent>
        </Dialog>
      </div>
    );
  }
}

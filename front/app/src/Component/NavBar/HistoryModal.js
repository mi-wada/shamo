import React from "react";
import IconButton from "@material-ui/core/IconButton";
import HistoryIcon from "@material-ui/icons/History";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default class HistoryModal extends React.Component {
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
        <IconButton aria-label="history" onClick={this.handleClickOpen}>
          <HistoryIcon />
        </IconButton>
        <Dialog open={this.state.isOpen} onClose={this.handleClose}>
          <DialogTitle id="form-dialog-title">History</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Who</TableCell>
                    <TableCell align="right">What</TableCell>
                    <TableCell align="right">When</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.payments.map((payment) => (
                    <TableRow key={payment.ID}>
                      <TableCell component="th" scope="row">
                        {payment.Price}
                      </TableCell>
                      <TableCell align="right">{payment.User_id}</TableCell>
                      <TableCell align="right">{payment.What}</TableCell>
                      <TableCell align="right">{payment.CreatedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

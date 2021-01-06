import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import PaymentForm from "./PaymentForm";
import ConfirmModal from "./ConfirmModal";
import HistoryModal from "./HistoryModal";

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <AppBar position="static">
          <Typography variant="h6" noWrap>
            Shamo
          </Typography>
          <PaymentForm users={this.props.users} />
          <ConfirmModal users={this.props.users} payments={this.props.payments} />
          <HistoryModal payments={this.props.payments} />
        </AppBar>
      </div>
    );
  }
}

import React from "react";
import Grid from "@material-ui/core/Grid";

import UserPayment from "./UserPayment";

export default class UserPayments extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container className="user-payments" spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            {this.props.users.map((user, index) => (
              <UserPayment key={index} user={user} payments={this.props.payments} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

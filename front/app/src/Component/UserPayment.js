import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default class UserPayment extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Grid item>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {this.props.user.Name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {this.props.payments.reduce((acc, cur) => {
                return cur.User_id === this.props.user.ID ? acc + cur.Price : acc;
              }, 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

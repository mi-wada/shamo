import React from "react";
import axios from "axios";

import "./App.css";
import "./Component/NavBar/NavBar";
import NavBar from "./Component/NavBar/NavBar";
import "./Component/UserPayments";
import UserPayments from "./Component/UserPayments";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      users: [],
      roomId: "1",
    };
  }
  componentDidMount() {
    axios.get("http://localhost:8080/users").then((res) => {
      const users = res.data;
      this.setState({ users });
    });
    axios.get("http://localhost:8080/payments").then((res) => {
      const payments = res.data;
      this.setState({ payments });
    });
  }
  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <NavBar payments={this.state.payments} users={this.state.users} />
        <UserPayments payments={this.state.payments} users={this.state.users} />
      </div>
    );
  }
}

export default App;

import React from 'react';
import './Login.css';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      pass: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        <div class="form">
          <form class="login-form">
            <img class="logo" src={require('./images/mcc-logo.png')}/>
            <input type="text" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <button class="login">login</button>
            <p class="message">Not registered? <a>Create an account</a></p><br/>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;

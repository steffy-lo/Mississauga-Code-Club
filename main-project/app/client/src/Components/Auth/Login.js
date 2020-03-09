import React from 'react';
import { Link } from 'react-router-dom';

import { getState } from 'statezero';

import { authenticate } from '../../Actions/auth.js';

import './Login.css';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      pass: "",
      loadingAuth: 0
    };
  }

  render() {
    return (
      <React.Fragment>
        <div id="authForm">
          <form className="login-form" onSubmit={e => {
            e.preventDefault();
            this.setState({email: this.state.email.trim()});
            if (this.state.loadingAuth) return;
            else {
              this.setState({loadingAuth: 1});
              authenticate(this.state.email, this.state.pass)
              .then(dest => {
                this.props.history.push(dest);
              })
              .catch((err) => {
                this.setState({loadingAuth: 0, pass: ""});
                console.log(err);
              })
            }
          }}>
            <img alt="Mississauga Code Club Logo"
                 className="logo"
                 src={require('./images/mcc-logo.png')}/>
               <input type="email" value={this.state.email} placeholder="email" onChange={e => {
              this.setState({email: e.target.value});
            }}/>
            <input type="password" value={this.state.pass} placeholder="password" onChange={e => {
              this.setState({pass: e.target.value});
            }}/>
            <button type="submit" className="login">login</button>

            {/*<p className="message">Not registered? <Link to="/">Create an account</Link></p><br/>*/}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;

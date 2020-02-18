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

    // return (
    //   <React.Fragment>
    //     <div id="mainWrapper">
    //       <h1>
    //         Login:
    //       </h1>
    //       <form id='loginForm'onSubmit={e => {
    //         e.preventDefault();
    //         console.log(`Email: ${this.state.email}`);
    //         console.log(`Password: ${this.state.pass}`)
    //       }}>
    //         <input className='textbox' type='text' placeholder='Email'
    //           onChange={e => {
    //           this.setState({email: e.currentTarget.value});
    //         }} />
    //         <input className='textbox' type='password' placeholder='Password'
    //           onChange={e => {
    //           this.setState({pass: e.currentTarget.value});
    //         }} />
    //         <input type='submit' id='submit' value='Login' />
    //         <input type='reset' id='reset' value='Clear' onClick={e => {
    //           this.setState({email: "", pass: ""});
    //         }}/>
    //       </form>
    //     </div>
    //   </React.Fragment>
    // );
    return (
      <div>
        <div class="form">
          <form class="login-form">
            <img class="logo" src={require('./images/mcc-logo.png')}/>
            <input type="text" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <button class="login">login</button>
            <p class="message">Not registered? <a>Create an account</a></p><br/>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;

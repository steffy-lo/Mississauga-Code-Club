import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { getAuth, isLocalAuthorised} from '../../Actions/auth';
import { getUserTypeExplicit } from '../../Actions/utility';

/* Debug typing */
//sessionStorage.setItem('uType', 1);
//sessionStorage.setItem('uType', 2);
//sessionStorage.setItem('uType', 3);
//sessionStorage.setItem('uType', 4);

export const ARoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    getAuth() !== "1" ? <Redirect to='/' /> : <Component {...props} />
  )} />
);

export const TRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    getAuth() !== "2" ? <Redirect to='/' /> : <Component {...props} />
  )} />
);

export const VRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    getAuth() !== "3" ? <Redirect to='/' /> : <Component {...props} />
  )} />
);

export const SRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
     getAuth() !== "4" ? <Redirect to='/' /> : <Component {...props} />
  )} />
);

export const LRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isLocalAuthorised() ? <Redirect to={`/${getUserTypeExplicit().charAt(0)}`}/> : <Component {...props} />
  )} />
);

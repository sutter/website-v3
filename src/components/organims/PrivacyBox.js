import React from 'react';
import Auth0Lock from "auth0-lock";
import { ProvidedAuthenticationBox } from '@getstation/authentication-ui';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

import PrivacyLogin from './privacy/PrivacyLogin';
import Offboarding from './privacy/Offboarding';
import OffboardingCancel from './privacy/OffboardingCancel';
import OffboardingComplete from './privacy/OffboardingComplete';
import OffboardingFail from './privacy/OffboardingFail';

import { httpLink, authLink } from '../../utils/apollo';

class PrivacyBox extends React.Component {
  constructor(props) {
    super(props);

    // Will hold Apollo Client
    this.client = null;


    // Bind necessary functions
    this.navigate = this.navigate.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);

    // Init internal State
    this.state = {
      isAuthenticated: false,
      profile: null,
      route: null,
    };
  }
  
  handleAuthentication = ({ idToken }) => {
    // Init an Apollo Client
    this.client = new ApolloClient({
      link: authLink(idToken).concat(httpLink),
      cache: new InMemoryCache(),
    });
    
    // Update state
    this.setState({
      profile: {
        given_name: 'Toto',
        email: 'email@oo.fr',
      },
      isAuthenticated: true,
      route: 'offboarding',
    });
  }

  navigate(route) {
    this.setState({ route });
  }

  render() {
    const { isAuthenticated, route, profile } = this.state;
    
    switch (route) {
      case 'cancelled':
        return (<OffboardingCancel navigate={this.navigate} logout={this.onLogout}></OffboardingCancel>);
      case 'confirmed':
        return (<OffboardingComplete navigate={this.navigate} logout={this.onLogout}></OffboardingComplete>);
      case 'failed':
        return (<OffboardingFail navigate={this.navigate}></OffboardingFail>);
    }

    if (isAuthenticated || route === 'offboarding') {
      return (
        <ApolloProvider client={this.client}>
          <Offboarding
            navigate={this.navigate}
            logout={this.onLogout}
            profile={profile}
          ></Offboarding>
        </ApolloProvider>
      );
    }

    return (
      <PrivacyLogin
        onAuthenticated={this.handleAuthentication}
      />
    );
  }
}

export default PrivacyBox;

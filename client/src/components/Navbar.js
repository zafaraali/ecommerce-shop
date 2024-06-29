import React, { Component } from 'react';
import { Box, Text, Heading, Image, Button } from 'gestalt';
import { NavLink, withRouter } from 'react-router-dom';
import { getToken, clearCart, clearToken } from '../utils/index';
class Navbar extends Component {
  handleSignOut = () => {
    clearToken();
    clearCart();
    this.props.history.push('/');
  };
  render() {
    return getToken() !== null ? (
      <AuthNav handleSignOut={this.handleSignOut} />
    ) : (
      <UnAuthNav />
    );
  }
}

const AuthNav = ({ handleSignOut }) => (
  <Box
    display='flex'
    alignItems='center'
    justifyContent='around'
    height={70}
    color='white'
    padding={1}
    shape='roundedBottom'
  >
    {/* Checkout link */}
    <NavLink activeClassName='active' to='/checkout'>
      <Text size='xl'>Checkout</Text>
    </NavLink>

    {/* Title and Logo */}
    <NavLink activeClassName='active' exact to='/'>
      <Box display='flex' alignItems='center'>
        <Box height={50} width={50} margin={2}>
          <Image
            src='./icons/logo.jpg'
            alt='Logo'
            naturalHeight={1}
            naturalWidth={1}
          />
        </Box>
        <div className='nav-title'>
          <Heading size='xs' color='orange'>
            {'Shoes Shop'}
          </Heading>
        </div>
      </Box>
    </NavLink>

    {/* Sign out Button */}
    <Button onClick={handleSignOut} text='Sign Out' inline size='md' />
  </Box>
);

const UnAuthNav = () => (
  <Box
    display='flex'
    alignItems='center'
    justifyContent='around'
    height={70}
    color='white'
    padding={1}
    shape='roundedBottom'
  >
    {/* Sign up link */}
    <NavLink activeClassName='active' to='/signup'>
      <Text size='xl'>Sign Up</Text>
    </NavLink>

    {/* Title and Logo */}
    <NavLink activeClassName='active' exact to='/'>
      <Box display='flex' alignItems='center'>
        <Box height={50} width={50} margin={2}>
          <Image
            src='./icons/logo.jpg'
            alt='Logo'
            naturalHeight={1}
            naturalWidth={1}
          />
        </Box>
        <div className='nav-title'>
          <Heading size='xs' color='orange'>
            {'Shoes Shop'}
          </Heading>
        </div>
      </Box>
    </NavLink>
    {/* Sign in link */}
    <NavLink activeClassName='active' to='/signin'>
      <Text size='xl'>Sign In</Text>
    </NavLink>
  </Box>
);

export default withRouter(Navbar);

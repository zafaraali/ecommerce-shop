import React, { Component } from 'react';
import { Container, Box, Button, Heading, Text, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
import { setToken } from '../utils/index';
const apiUrl = process.env.REACT_APP_API_URL;
const strapi = new Strapi(apiUrl);

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      toast: false,
      toastMessage: '',
      loading: false
    };
  }
  handleChange = ({ event, value }) => {
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, email, password } = this.state;
    if (!this.isFormEmpty(this.state)) {
      // Proceed with sign up
      try {
        this.setState({ loading: true });
        const response = await strapi.register(username, email, password);
        this.setState({ loading: false });
        setToken(response.jwt);
        this.redirectUser('/');
        // redirect to home page
      } catch (err) {
        this.setState({ loading: false });
        this.showToast('Sign up error.');
      }
    } else {
      this.showToast('Please fill in all fields.');
    }
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  };

  showToast = toastMessage => {
    this.setState({
      toast: true,
      toastMessage
    });
    setTimeout(
      () =>
        this.setState({
          toast: false,
          toastMessage: ''
        }),
      2000
    );
  };

  render() {
    const { toastMessage, toast, loading } = this.state;
    return (
      <Container>
        <Box
          marginTop={5}
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#dcdcdc'
            }
          }}
          margin={4}
          padding={4}
          shape='rounded'
          display='flex'
          justifyContent='center'
        >
          {/* Sign Up Form  */}
          <form
            onSubmit={this.handleSubmit}
            style={{
              display: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
          >
            {/* Sign Up Form Heading */}
            <Box
              marginBottom={2}
              display='flex'
              direction='column'
              alignItems='center'
            >
              <Heading color='orange'>Let's Get Started</Heading>
              <Text italic color='gray'>
                Sign up to order some kicks
              </Text>
            </Box>
            {/* Username Input */}
            <TextField
              id='username'
              type='text'
              name='username'
              placeholder='Username'
              onChange={this.handleChange}
            />
            {/* Email Input */}
            <TextField
              id='email'
              type='email'
              name='email'
              placeholder='Email Address'
              onChange={this.handleChange}
            />
            {/* Password Input */}
            <TextField
              id='password'
              type='password'
              name='password'
              placeholder='Password'
              onChange={this.handleChange}
            />
            <Box marginTop={2}>
              <Button
                inline
                disabled={loading}
                color='blue'
                text='Submit'
                type='submit'
              />
            </Box>
          </form>
        </Box>
        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    );
  }
}

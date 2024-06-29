import React, { Component } from 'react';
import { Container, Box, Button, Heading, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
import { setToken } from '../utils/index';
const apiUrl = process.env.REACT_APP_API_URL;
const strapi = new Strapi(apiUrl);

export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
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
    const { username, password } = this.state;
    if (!this.isFormEmpty(this.state)) {
      // Proceed with sign up
      try {
        this.setState({ loading: true });
        const response = await strapi.login(username, password);
        this.setState({ loading: false });
        setToken(response.jwt);
        this.redirectUser('/');
        // redirect to home page
      } catch (err) {
        this.setState({ loading: false });
        this.showToast(err.message);
      }
    } else {
      this.showToast('Please fill in all fields.');
    }
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ username, password }) => {
    return !username || !password;
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
          {/* Sign In Form  */}
          <form
            onSubmit={this.handleSubmit}
            style={{
              display: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
          >
            {/* Sign In Form Heading */}
            <Box
              marginBottom={5}
              display='flex'
              direction='column'
              alignItems='center'
            >
              <Heading color='orange'>Welcome back!</Heading>
            </Box>
            {/* Username Input */}
            <TextField
              id='username'
              type='text'
              name='username'
              placeholder='Username'
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

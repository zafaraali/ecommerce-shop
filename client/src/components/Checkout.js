import React, { Component } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  TextField,
  Modal,
  Spinner,
  Button
} from 'gestalt';
import ToastMessage from './ToastMessage';
import { getCart, calculatePrice } from '../utils/index';
export default class Checkout extends Component {
  state = {
    cartItems: [],
    address: '',
    postalCode: '',
    city: '',
    confirmationEmailAddress: '',
    toast: false,
    toastMessage: '',
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }
  handleChange = ({ event, value }) => {
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async event => {
    event.preventDefault();

    if (!this.isFormEmpty(this.state)) {
      this.setState({ modal: true });
    } else {
      this.showToast('Please fill in all fields.');
    }
  };

  handleSubmitOrder = () => {};

  closeModal = () => {
    this.setState({ modal: false });
  };
  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
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
    const {
      toast,
      toastMessage,
      cartItems,
      modal,
      orderProcessing
    } = this.state;
    return (
      <Container>
        <Box
          color='darkWash'
          marginTop={5}
          margin={4}
          padding={4}
          shape='rounded'
          display='flex'
          justifyContent='center'
          alignItems='center'
          direction='column'
        >
          {/* Checkout Form Heading */}

          <Heading color='orange'>Checkout</Heading>

          {cartItems.length > 0 ? (
            <React.Fragment>
              {' '}
              {/* User Cart */}
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                direction='column'
                marginTop={2}
                marginBottom={6}
              >
                <Text color='darkGray' italic>
                  {cartItems.length} items for Checkout
                </Text>
                <Box padding={2}>
                  {cartItems.map(item => (
                    <Box key={item._id} padding={1}>
                      <Text>
                        {item.name} x {item.quantity} - $
                        {item.quantity * item.price}
                      </Text>
                    </Box>
                  ))}
                  <Box padding={1}>
                    <Text bold>Total Amount: {calculatePrice(cartItems)} </Text>
                  </Box>
                </Box>
              </Box>
              {/* Checkout Form  */}
              <form
                onSubmit={this.handleConfirmOrder}
                style={{
                  display: 'inlineBlock',
                  textAlign: 'center',
                  maxWidth: 450
                }}
              >
                {/* Shipping Address Input */}
                <TextField
                  id='address'
                  type='text'
                  name='address'
                  placeholder='Shipping Address'
                  onChange={this.handleChange}
                />
                {/* Postal Code Input */}
                <TextField
                  id='postalCode'
                  type='text'
                  name='postalCode'
                  placeholder='Postal Code'
                  onChange={this.handleChange}
                />
                {/* City Input */}
                <TextField
                  id='city'
                  type='text'
                  name='city'
                  placeholder='City'
                  onChange={this.handleChange}
                />
                {/* Confirmation Email Input */}
                <TextField
                  id='confirmationEmailAddress'
                  type='email'
                  name='confirmationEmailAddress'
                  placeholder='Confirmaton Email Address'
                  onChange={this.handleChange}
                />
                <Box marginTop={2}>
                  <button id='checkoutButton' type='submit'>
                    Submit
                  </button>
                </Box>
              </form>
            </React.Fragment>
          ) : (
            /* No items in cart text*/
            <Box color='darkWash' shape='rounded' padding={4}>
              <Heading align='center' color='watermelon' size='xs'>
                Your Cart Is Empty
              </Heading>
            </Box>
          )}
        </Box>
        {/* Confirmation Modal */}
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}

        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    );
  }
}

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder
}) => (
  <Modal
    accessibilityCloseLabel='close'
    accessibilityModalLabel='Confirm Your Order'
    heading='Confirm Your Order'
    onDismiss={closeModal}
    footer={
      <Box
        display='flex'
        marginRight={-1}
        marginLeft={-1}
        justifyContent='center'
      >
        <Box padding={1}>
          <Button
            size='lg'
            color='red'
            text='Submit'
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size='lg'
            text='Cancel'
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role='alertdialog'
    size='sm'
  >
    {/* Order Summary */}
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      direction='column'
      padding={2}
      color='lightWash'
    >
      {cartItems.map(item => (
        <Box key={item._id} padding={1}>
          <Text size='lg' color='red'>
            {item.name} x {item.quantity} - ${item.quantity * item.price}
          </Text>
        </Box>
      ))}
      <Box paddingY={2}>
        <Text size='lg' bold>
          Total: {calculatePrice(cartItems)}
        </Text>
      </Box>
    </Box>
    {/* Order Processing Spinner */}
    <Box marginTop={2}>
      <Spinner
        show={orderProcessing}
        accessibilityLabel='Order Processing Spinner'
      />
    </Box>
    {orderProcessing && (
      <Text align='center' italic>
        Submitting Order...
      </Text>
    )}
  </Modal>
);

import React, { Component } from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import {
  Box,
  Heading,
  Button,
  Text,
  Card,
  Image,
  Container,
  Mask,
  IconButton
} from 'gestalt';
import Loader from './Loader';
import { Link } from 'react-router-dom';
import { calculatePrice, setCart, getCart } from '../utils/index';

const apiUrl = process.env.REACT_APP_API_URL;
const strapi = new Strapi(apiUrl);

export default class shoes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shoes: [],
      brand: '',
      loadingshoes: true,
      cartItems: []
    };
  }
  async componentDidMount() {
    try {
      const { data } = await strapi.request('POST', '/graphql', {
        data: {
          query: `query{
            brand(id: "${this.props.match.params.brandId}"){
             _id
             name
             shoes{
               _id
               name
               description
              imageUrl
               price
               
             }
           }
         }`
        }
      });
      this.setState({
        shoes: data.brand.shoes,
        brand: data.brand.name,
        cartItems: getCart()
      });
    } catch (err) {
      console.error(err);
    }
    this.setState({ loadingshoes: false });
  }

  addToCart = shoe => {
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === shoe._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...shoe,
        quantity: 1
      });
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCart = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(
      item => item._id !== itemToDeleteId
    );
    this.setState({ cartItems: filteredItems }, setCart(filteredItems));
  };

  render() {
    const { brand, shoes, loadingshoes, cartItems } = this.state;
    return (
      <Container>
        <Box
          marginTop={4}
          display='flex'
          justifyContent='center'
          alignItems='start'
          dangerouslySetInlineStyle={{
            __style: {
              flexWrap: 'wrap-reverse'
            }
          }}
        >
          {/* Shoes Section */}
          <Box display='flex' direction='column' alignItems='center'>
            {/* Shoes Heading */}
            <Box margin={2}>
              <Heading color='orchid'>{brand}</Heading>
            </Box>
            {/* Shoes */}
            <Box
              dangerouslySetInlineStyle={{
                __style: {
                  backgroundColor: '#bdcdd9'
                }
              }}
              shape='rounded'
              display='flex'
              wrap
              justifyContent='center'
              padding={4}
            >
              {shoes.map(shoe => (
                <Box paddingY={4} margin={2} width={210} key={shoe._id}>
                  <Card
                    image={
                      <Box height={250} width={200}>
                        <Image
                          fit='contain'
                          naturalHeight={1}
                          naturalWidth={1}
                          src={shoe.imageUrl}
                          alt={shoe.name}
                        />
                      </Box>
                    }
                  >
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      direction='column'
                    >
                      <Box marginBottom={2}>
                        <Text size='xl'>{shoe.name}</Text>
                      </Box>
                      <Text size='xl'>{shoe.description}</Text>
                      <Box marginTop={2}>
                        <Text color='orchid'>${shoe.price}</Text>
                      </Box>
                      <Box marginTop={4}>
                        <Text size='xl'>
                          <Button
                            onClick={() => this.addToCart(shoe)}
                            color='blue'
                            text='Add to Cart'
                          />
                        </Text>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
          {/* User Cart */}
          <Box alignSelf='end' marginTop={2} marginLeft={8}>
            <Mask shape='rounded' wash>
              <Box
                display='flex'
                direction='column'
                alignItems='center'
                padding={2}
              >
                {/* User Cart Heading */}
                <Heading align='center' size='sm'>
                  Your Cart
                </Heading>
                <Text color='gray' italic>
                  {cartItems.length} items selected
                </Text>

                {/* Cart Items */}
                {cartItems.map(item => (
                  <Box key={item._id} display='flex' alignItems='center'>
                    <Text>
                      {item.name} x {item.quantity} -{' '}
                      {(item.quantity * item.price).toFixed(2)}
                    </Text>
                    <IconButton
                      accessibilityLabel='Delete Item'
                      icon='cancel'
                      size='sm'
                      iconColor='red'
                      onClick={() => this.deleteItemFromCart(item._id)}
                    />
                  </Box>
                ))}

                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  direction='column'
                >
                  <Box margin={2}>
                    {cartItems.length === 0 && (
                      <Text color='red'>Please selected some items</Text>
                    )}
                  </Box>
                  <Text size='lg'>Total: {calculatePrice(cartItems)}</Text>
                  <Text>
                    <Link to='/checkout'>Checkout</Link>
                  </Text>
                </Box>
              </Box>
            </Mask>
          </Box>
        </Box>
        <Loader show={loadingshoes} />
      </Container>
    );
  }
}

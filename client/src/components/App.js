import React, { Component } from 'react';
import './App.css';
import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField,
  Icon
} from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';
import { Link } from 'react-router-dom';
import Loader from './Loader';
const apiUrl = process.env.REACT_APP_API_URL;
const strapi = new Strapi(apiUrl);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      searchTerm: '',
      loadingBrands: true
    };
  }
  async componentDidMount() {
    try {
      const { data } = await strapi.request('POST', '/graphql', {
        data: {
          query: `
    query{
      brands{
      _id, 
        name,
        description,
       imageUrl
      }
    }`
        }
      });
      this.setState({
        brands: data.brands
      });
    } catch (err) {
      console.error(err);
    }
    this.setState({ loadingBrands: false });
  }

  handleChange = ({ value }) => {
    this.setState({
      searchTerm: value
    });
  };
  filteredBrands = ({ searchTerm, brands }) => {
    return brands.filter(brand => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  render() {
    const { searchTerm, loadingBrands } = this.state;
    return (
      <Container>
        {/* Brand Search Field */}
        <Box display='flex' justifyContent='center' marginTop={8}>
          <SearchField
            id='searchField'
            accessibilityLabel='Brands Search Field'
            onChange={this.handleChange}
            placeholder='Search Brands'
            value={searchTerm}
          />
          <Box margin={2}>
            <Icon
              icon='filter'
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel='Filter'
            />
          </Box>
        </Box>

        {/* Brands Section */}
        <Box
          display='flex'
          justifyContent='center'
          marginBottom={2}
          marginTop={4}
        >
          {/* Brands Header */}
          <Heading color='darkGray' size='md'>
            Shoe Brands
          </Heading>
        </Box>
        {/* Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#DCDCDC'
            }
          }}
          shape='rounded'
          wrap
          display='flex'
          justifyContent='around'
          marginTop={5}
        >
          {this.filteredBrands(this.state).map(brand => (
            <Box paddingY={4} margin={2} width={200} key={brand._id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      fit='cover'
                      alt='Brand'
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${brand.imageUrl}`}
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
                  <Text size='xl' bold>
                    {brand.name}
                  </Text>
                  <Box marginTop={2}>
                    <Text size='xl'>{brand.description}</Text>
                  </Box>
                  <Box marginTop={2}>
                    <Text size='xl'>
                      <Link to={`/${brand._id}`}>See Shoes</Link>
                    </Text>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;

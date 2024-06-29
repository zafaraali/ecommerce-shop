import React from 'react';
import { GridLoader } from 'react-spinners';
import { Box } from 'gestalt';

export default function Loader({ show }) {
  return (
    show && (
      <Box
        position='fixed'
        dangerouslySetInlineStyle={{
          __style: {
            bottom: 300,
            left: '50%',
            transform: 'translateX(-50%)'
          }
        }}
      >
        <GridLoader color='#9c660c' size={25} margin='3px' />
      </Box>
    )
  );
}

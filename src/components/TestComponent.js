import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const TestComponent = () => {
  return (
    <Box>
      <Heading as="h1" size="xl">Heading 1</Heading>
      <Heading as="h2" size="lg">Heading 2</Heading>
      <Heading as="h3" size="md">Heading 3</Heading>
      <Heading as="h4" size="sm">Heading 4</Heading>
      <Heading as="h5" size="xs">Heading 5</Heading>
      <Text>Normal Text</Text>
    </Box>
  );
};

export default TestComponent;
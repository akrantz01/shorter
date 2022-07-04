import { ArrowBackIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import React from 'react';

export default function NotFound(): JSX.Element {
  return (
    <Box mx="auto" textAlign="center" p={6}>
      <QuestionOutlineIcon mx="auto" h={12} w={12} color="gray.400" aria-hidden="true" />
      <Heading size="md" mt={2} color="gray.900" fontWeight="md">
        Page not found
      </Heading>
      <Text mt={1} size="sm" color="gray.500">
        We couldn't find the page you're looking for. Please check it is correct and try again
      </Text>
      <Box mt={6}>
        <Button as={Link} to="/" leftIcon={<ArrowBackIcon />}>
          Return home
        </Button>
      </Box>
    </Box>
  );
}

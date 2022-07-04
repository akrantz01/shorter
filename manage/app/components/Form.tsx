import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Link, Form as RemixForm, useTransition } from '@remix-run/react';
import type { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  description: ReactNode;
  returnTo: string;
  children?: ReactNode;
}

export default function Form({ title, description, returnTo, children }: Props): JSX.Element {
  const { state } = useTransition();

  return (
    <VStack as={RemixForm} method="post" align="stretch">
      <Box>
        <Heading size="lg" color="gray.900" fontWeight="md">
          {title}
        </Heading>
        <Text mt={1} size="sm" color="gray.500" maxW="2xl">
          {description}
        </Text>
      </Box>

      <Box mt={{ base: 6, sm: 5 }}>{children}</Box>

      <Flex pt={5} justifyContent="end">
        <Button as={Link} to={returnTo} variant="outline">
          Back
        </Button>
        <Button type="submit" ml={3} colorScheme="green" isLoading={state !== 'idle'}>
          Save
        </Button>
      </Flex>
    </VStack>
  );
}

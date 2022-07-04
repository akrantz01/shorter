import { LinkIcon } from '@chakra-ui/icons';
import { Box, Heading } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import React from 'react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props): JSX.Element {
  return (
    <>
      <Box backgroundColor="gray.800" pb={32}>
        <Box as="header" py={10}>
          <Box mx="auto" maxW="7xl" px={{ base: 4, sm: 6, lg: 6 }}>
            <Heading color="white" display="flex" size="3xl">
              <LinkIcon mr={4} h={12} w={12} aria-hidden="true" />
              Shorter
            </Heading>
          </Box>
        </Box>
      </Box>
      <Box as="main" mt={-32}>
        <Box mx="auto" pb={12} maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Box backgroundColor="white" borderRadius="lg" shadow="base" py={6} px={{ base: 5, sm: 6 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
}

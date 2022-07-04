import { AddIcon, ArrowRightIcon, CopyIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, IconButton, Td, Text, Tr, useToast } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import React from 'react';

interface EmptyRowProps {
  title: string;
  description: string;
  promptCreate?: boolean;
}

export function EmptyRow({ title, description, promptCreate = false }: EmptyRowProps): JSX.Element {
  return (
    <Tr>
      <Td colSpan={3} mx="auto" textAlign="center" p={6}>
        <QuestionOutlineIcon mx="auto" h={12} w={12} color="gray.400" aria-hidden="true" />
        <Heading size="md" mt={2} color="gray.900" fontWeight="md">
          {title}
        </Heading>
        <Text mt={1} size="sm" color="gray.500">
          {description}
        </Text>
        {promptCreate && (
          <Box mt={6}>
            <Button as={Link} to="/new" leftIcon={<AddIcon />}>
              New
            </Button>
          </Box>
        )}
      </Td>
    </Tr>
  );
}

interface RowProps {
  slug: string;
}

export function Row({ slug }: RowProps): JSX.Element {
  const toast = useToast();

  const onCopy = async () => {
    await navigator.clipboard.writeText(`https://wffl.link/${slug}`);
    toast({
      title: 'Link copied!',
      status: 'success',
      duration: 2500,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <Tr>
      <Td color="gray.600">{slug}</Td>
      <Td>
        <IconButton aria-label="Copy link" icon={<CopyIcon />} variant="outline" size="sm" onClick={onCopy} />
      </Td>
      <Td isNumeric>
        <IconButton
          as={Link}
          to={`/links/${slug}`}
          aria-label="Details"
          icon={<ArrowRightIcon h={2} w={2} />}
          size="sm"
          variant="outline"
        />
      </Td>
    </Tr>
  );
}

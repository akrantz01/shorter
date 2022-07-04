import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';

import { EmptyRow, Row } from '~/components/Row';
import type { LoaderFunction } from '~/lib/types';

export const loader: LoaderFunction = async ({ context }) => {
  const links = await context.links.list();
  return json(links.keys.map((item) => item.name));
};

export default function Index() {
  const [filter, setFilter] = useState('');

  const links = useLoaderData<string[]>();
  const filtered = links.filter((slug) => slug.startsWith(filter));

  return (
    <>
      <Flex justify="space-between">
        <Heading mt={1} size="lg" fontWeight="md">
          Links
        </Heading>
        <Button as={Link} to="/new" colorScheme="green" rightIcon={<AddIcon />}>
          New
        </Button>
      </Flex>

      <InputGroup mt={5} maxW="lg">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search..."
          value={filter}
          onInput={(e) => setFilter((e.target as HTMLInputElement).value)}
        />
      </InputGroup>

      <TableContainer mt={5}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Slug</Th>
              <Th>Copy Link</Th>
              <Th isNumeric>Details</Th>
            </Tr>
          </Thead>
          <Tbody>
            {links.length === 0 && (
              <EmptyRow title="No links yet" description="Get started by adding a new short-link" promptCreate />
            )}
            {links.length !== 0 && filtered.length === 0 && (
              <EmptyRow
                title="No links found"
                description="We couldn't find any links matching your query. Please try again."
              />
            )}
            {filtered.map((s) => (
              <Row slug={s} key={s} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

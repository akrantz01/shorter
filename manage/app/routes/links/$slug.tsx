import { ArrowBackIcon, CheckIcon, CloseIcon, CopyIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Link as ChakraLink,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { json, redirect } from '@remix-run/cloudflare';
import { Link, useFetcher, useLoaderData, useParams } from '@remix-run/react';
import type { ReactNode } from 'react';

import DeleteButton from '~/components/DeleteButton';
import type { ActionFunction, LoaderFunction, ShortLink } from '~/lib/types';

export const action: ActionFunction = async ({ request, params, context }) => {
  const slug = params.slug as string;

  switch (request.method) {
    case 'PUT':
      // Find the link
      const link = await context.links.get<ShortLink>(slug, { type: 'json' });
      if (!link) throw new Response('not found', { status: 404 });

      // Change the state
      link.enabled = !link.enabled;
      await context.links.put(slug, JSON.stringify(link));

      return redirect(`/links/${slug}`);

    case 'DELETE':
      await context.links.delete(slug);
      return redirect('/');

    default:
      return json({ message: 'method not allowed' }, { status: 405 });
  }
};

export const loader: LoaderFunction = async ({ params, context }) => {
  const slug = params.slug as string;
  const link = await context.links.get<ShortLink>(slug, { type: 'json' });

  if (link) return link;
  else throw new Response('not found', { status: 404 });
};

interface ItemProps {
  label: string;
  children: ReactNode;
}

function Item({ label, children }: ItemProps): JSX.Element {
  return (
    <Grid
      py={{ base: 4, sm: 5 }}
      px={4}
      templateColumns={{ base: 'repeat(1, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' }}
      gap={{ sm: 4 }}
    >
      <GridItem>
        <Text as="span" size="sm" fontWeight="md" color="gray.500">
          {label}
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: 1, sm: 2 }}>
        <Text as="span" mt={{ base: 1, sm: 0 }} size="sm" color="gray.900">
          {children}
        </Text>
      </GridItem>
    </Grid>
  );
}

export default function ViewLink() {
  const { slug } = useParams();
  const data = useLoaderData<ShortLink>();

  const fetcher = useFetcher();

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
    <>
      <Box>
        <Flex justifyContent="space-between">
          <Heading size="lg" color="gray.900" fontWeight="md" className="text-lg leading-6 font-medium text-gray-900">
            Short-link Information
          </Heading>
          <ButtonGroup size="sm" variant="outline" spacing="3">
            <Button onClick={onCopy} leftIcon={<CopyIcon />}>
              Copy
            </Button>
            <Button as={Link} to="edit" leftIcon={<EditIcon />}>
              Edit
            </Button>
          </ButtonGroup>
        </Flex>
        <Text mt={1} maxW="2xl" size="sm" color="gray.500">
          Analytics and configuration details.
        </Text>
      </Box>

      <Divider mt={5} color="gray.200" />

      <Item label="Slug">{slug}</Item>

      <Divider color="gray.200" />

      <Item label="URL">
        <ChakraLink color="blue.500" href={data.url} isExternal>
          {data.url}
        </ChakraLink>
      </Item>

      <Divider color="gray.200" />

      <Item label="Enabled">
        <IconButton
          size="lg"
          aria-label={data.enabled ? 'Disable' : 'Enable'}
          icon={data.enabled ? <CheckIcon color="green.500" /> : <CloseIcon color="red.500" />}
          onClick={() => fetcher.submit({}, { method: 'put' })}
          isLoading={fetcher.state !== 'idle'}
        />
      </Item>

      <Divider color="gray.200" />

      <Item label="Total Clicks">{data.usages}</Item>

      <Divider color="gray.200" />

      <Flex mt={3} justifyContent="space-between">
        <Button as={Link} to="/" leftIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <DeleteButton slug={slug as string} />
      </Flex>
    </>
  );
}

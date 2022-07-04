import { FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { json, redirect } from '@remix-run/cloudflare';
import { useActionData, useParams } from '@remix-run/react';

import Form from '~/components/Form';
import type { ActionFunction, LoaderFunction } from '~/lib/types';

interface Validated {
  error?: string;
  value: string;
}

export const action: ActionFunction = async ({ params: { slug }, context, request }) => {
  const form = await request.formData();

  // Get the new slug
  const newSlug = form.get('updated');
  if (typeof newSlug !== 'string') return json({ error: 'This field is required' }, { status: 400 });

  // Check the slug is valid
  if (!/^[a-z0-9-]+$/.test(newSlug))
    return json({ error: 'Can only contain lowercase alphanumeric characters and dashes' }, { status: 400 });

  // Check a short-link doesn't already exist at the target name
  const target = await context.links.get(newSlug);
  if (target) return json({ error: 'A short-link already exists with this slug' }, { status: 400 });

  // Get the original
  const original = await context.links.get(slug as string);
  if (!original) throw new Response('not found', { status: 404 });

  // Move it to the new location and delete the old one
  await context.links.put(newSlug, original);
  await context.links.delete(slug as string);

  return redirect(`/links/${newSlug}`);
};

export const loader: LoaderFunction = async ({ params: { slug }, context }) => {
  const link = await context.links.get(slug as string);
  if (link) return null;
  else throw new Response('not found', { status: 404 });
};

export default function Rename(): JSX.Element {
  const { slug } = useParams();
  const result = useActionData<Validated>();

  return (
    <Form
      title="Renaming short-link"
      description="This will change the slug where the short-link can be accessed"
      returnTo={`/links/${slug}`}
    >
      <FormControl isReadOnly>
        <FormLabel htmlFor="original">Original Slug</FormLabel>
        <InputGroup>
          <InputLeftAddon children="wffl.link/" />
          <Input id="original" name="original" value={slug} />
        </InputGroup>
      </FormControl>

      <FormControl mt={{ base: 6, sm: 5 }} isRequired isInvalid={!!result?.error}>
        <FormLabel htmlFor="updated">New Slug</FormLabel>
        <InputGroup>
          <InputLeftAddon children="wffl.link/" />
          <Input id="updated" name="updated" />
        </InputGroup>
        {result?.error && <FormErrorMessage>{result?.error}</FormErrorMessage>}
      </FormControl>
    </Form>
  );
}

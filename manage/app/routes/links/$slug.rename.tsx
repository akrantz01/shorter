import { FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { json, redirect } from '@remix-run/cloudflare';
import { useActionData, useParams } from '@remix-run/react';

import Form from '~/components/Form';
import type { ActionFunction } from '~/lib/types';

interface Validated {
  error?: string;
  value: string;
}

export const action: ActionFunction = async ({ params: { slug }, context, request }) => {
  const form = await request.formData();

  // Get the new slug
  const newSlug = form.get('updated');
  if (typeof newSlug !== 'string') return json({ error: 'This field is required' });

  // Check the slug is valid
  if (!/^[a-z0-9-]+$/.test(newSlug))
    return json({ error: 'Can only contain lowercase alphanumeric characters and dashes' });

  // Get the original
  const original = await context.links.get(slug as string);
  if (!original) throw new Response('not found', { status: 404 });

  // Move it to the new location and delete the old one
  await context.links.put(newSlug, original);
  await context.links.delete(slug as string);

  return redirect(`/links/${newSlug}`);
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

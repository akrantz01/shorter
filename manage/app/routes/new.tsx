import { FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { json, redirect } from '@remix-run/cloudflare';
import { useActionData } from '@remix-run/react';

import Form from '~/components/Form';
import type { ActionFunction, ShortLink } from '~/lib/types';
import type { Validated } from '~/lib/validate';
import validate from '~/lib/validate';

export const action: ActionFunction = async ({ request, context }) => {
  const params = await request.formData();

  // Validate inputs
  const result = validate(params);
  if (result.errors) return json(result, { status: 400 });

  const { values } = result;

  // Insert into the database
  const link: ShortLink = { enabled: true, usages: 0, url: values.url };
  await context.links.put(values.slug, JSON.stringify(link));

  return redirect(`/links/${values.slug}`);
};

export default function New(): JSX.Element {
  const data = useActionData<Validated>();

  return (
    <Form title="New Short-link" description="Create a new short-link for people to use" returnTo="/">
      <FormControl isRequired isInvalid={!!data?.errors?.slug}>
        <FormLabel htmlFor="slug">Slug</FormLabel>
        <InputGroup>
          <InputLeftAddon children="wffl.link/" />
          <Input id="slug" name="slug" defaultValue={data?.values.slug} />
        </InputGroup>
        {data?.errors?.slug && <FormErrorMessage>{data?.errors?.slug}</FormErrorMessage>}
      </FormControl>

      <FormControl mt={{ base: 6, sm: 5 }} isRequired isInvalid={!!data?.errors?.url}>
        <FormLabel htmlFor="url">URL</FormLabel>
        <Input id="url" name="url" defaultValue={data?.values.url} />
        {data?.errors?.url && <FormErrorMessage>{data?.errors?.url}</FormErrorMessage>}
      </FormControl>
    </Form>
  );
}

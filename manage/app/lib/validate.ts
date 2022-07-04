interface Params {
  slug: string;
  url: string;
}

export interface Validated {
  errors?: Partial<Params>;
  values: Params;
}

const getString = (form: FormData, key: string): string | null => {
  const value = form.get(key);
  if (typeof value !== 'string') return null;
  else return value;
};

const isValidURL = (test: string): boolean => {
  try {
    new URL(test);
    return true;
  } catch {
    return false;
  }
};

export default function validate(form: FormData): Validated {
  const errors: Partial<Params> = {};

  // Ensure fields exist
  const slug = getString(form, 'slug');
  if (!slug) errors.slug = 'This field is required';
  else if (!/^[a-z0-9-]+$/.test(slug)) errors.slug = 'Can only contain lowercase alphanumeric characters and dashes';

  const url = getString(form, 'url');
  if (!url) errors.url = 'This field is required';
  else if (!isValidURL(url)) errors.url = 'Invalid URL';

  return {
    errors: Object.keys(errors).length === 0 ? undefined : errors,
    values: { slug: slug || '', url: url || '' },
  };
}

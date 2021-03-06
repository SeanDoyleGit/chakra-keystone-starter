import { list } from '@keystone-6/core';
import { text, password } from '@keystone-6/core/fields';

export const lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
    },
  }),
  Todo: list({
    fields: {
      label: text({
        validation: { isRequired: true },
      }),
    },
    graphql: {
      cacheHint: { maxAge: 60 * 60, scope: 'PUBLIC' },
    },
  }),
};

import React from 'react';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';

import { AuthProvider } from '../lib/authentication';
import { useApollo } from '../lib/apollo';

import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

const customTheme = extendTheme(
  withDefaultColorScheme({
    colorScheme: 'green',
  }),
  {
    components: {
      Link: {
        variants: {
          primary: ({ colorScheme = 'green' }) => ({
            color: `${colorScheme}.500`,
            _hover: {
              color: `${colorScheme}.400`,
            },
          }),
        },
        defaultProps: {
          variant: 'primary',
        },
      },
    },
  }
);

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider apolloClient={apolloClient}>
        <ChakraProvider theme={customTheme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

import { useMemo } from 'react';
import getConfig from 'next/config';
import { ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'cross-fetch';

const {
  publicRuntimeConfig: { serverUrl },
} = getConfig();

let apolloClient = null;

const isServer = () => typeof window === 'undefined';
const isClient = () => typeof window !== 'undefined';

function createLinks() {
  const links = [];

  links.push(
    createUploadLink({
      uri: `${serverUrl}/api/graphql`, // Server URL (must be absolute)
      fetchOptions: {
        credentials: 'include',
      },
      fetch,
    })
  );

  return links;
}

function createApolloClient() {
  return new ApolloClient({
    connectToDevTools: isClient(),
    ssrMode: isServer(), // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from(createLinks()),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState) {
  const _apolloClient = apolloClient || createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    const cache = _apolloClient.cache.extract();
    _apolloClient.cache.restore({
      ...cache,
      ...initialState,
      ROOT_QUERY: { ...cache?.ROOT_QUERY, ...initialState.ROOT_QUERY },
    });
  }
  // For SSG and SSR always create a new Apollo Client
  if (isServer()) return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

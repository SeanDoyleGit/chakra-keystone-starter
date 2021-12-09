import React, { createContext, useState, useContext, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

export const SIGN_IN = gql`
  mutation signin($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          name
          email
        }
      }
    }
  }
`;

export const SIGN_OUT = gql`
  mutation {
    unauthenticateUser {
      success
    }
  }
`;

export const GET_AUTHENTICATED_USER = gql`
  {
    authenticatedItem {
      ... on User {
        id
        name
        email
      }
    }
  }
`;

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ apolloClient, children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { data: { authenticatedItem } = {}, loading } = useQuery(GET_AUTHENTICATED_USER, {
    fetchPolicy: 'network-only',
    ssr: false,
  });

  useEffect(() => {
    setUser(authenticatedItem);
    setIsLoading(loading);
  }, [authenticatedItem, loading]);

  const signin = async ({ email, password }) => {
    setIsLoading(true);

    const {
      data: { authenticateUserWithPassword },
      error,
    } = await apolloClient.mutate({
      mutation: SIGN_IN,
      fetchPolicy: 'no-cache',
      variables: { email, password },
    });

    if (error) {
      throw error;
    }

    await apolloClient.resetStore();
    if (authenticateUserWithPassword?.item) {
      setUser(authenticateUserWithPassword.item);
      setIsLoading(false);
    }
  };

  const signout = async () => {
    setIsLoading(true);
    const {
      data: { unauthenticateUser },
      error,
    } = await apolloClient.mutate({
      mutation: SIGN_OUT,
      fetchPolicy: 'no-cache',
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }
    if (unauthenticateUser?.success) {
      setUser(null);
      setIsLoading(false);
    }
    await apolloClient.resetStore();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading: isLoading,
        signin,
        signout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

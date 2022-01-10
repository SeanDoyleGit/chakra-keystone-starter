import React, { createContext, useState, useContext, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

export const SIGN_UP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    user: createUser(data: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

export const SIGN_IN = gql`
  mutation Signin($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          name
          email
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

export const SIGN_OUT = gql`
  mutation Signout {
    endSession
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
    } else if (authenticateUserWithPassword?.message) {
      setIsLoading(false);
      throw new Error(authenticateUserWithPassword?.message);
    }
  };

  const signup = async ({ name, email, password }) => {
    const {
      data: { user },
      error,
    } = await apolloClient.mutate({
      mutation: SIGN_UP,
      fetchPolicy: 'no-cache',
      variables: { name, email, password },
    });

    if (error || !user) {
      throw error;
    }

    await signin({ email, password });
  };

  const signout = async () => {
    setIsLoading(true);
    const {
      data: { endSession },
      error,
    } = await apolloClient.mutate({
      mutation: SIGN_OUT,
      fetchPolicy: 'no-cache',
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error);
    }

    if (endSession) {
      setUser(null);
      setIsLoading(false);
      await apolloClient.resetStore();
    } else {
      throw new Error('Unable to signout');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading: isLoading,
        signin,
        signout,
        signup,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

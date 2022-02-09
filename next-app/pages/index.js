import Head from 'next/head';
import { Button, Center, Container, Heading, Link, Stack, Text } from '@chakra-ui/react';

import { useAuth } from '../lib/authentication';

export default function Home() {
  const { user, isAuthenticated, signout } = useAuth();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <Container>
      <Head>
        <title>Chakra/Keystone Example</title>
      </Head>
      <Center height="100vh" pb={40}>
        <Stack>
          {isAuthenticated && <Heading as="h1">Hello {user && user.name}</Heading>}
          {!isAuthenticated && <Heading as="h1">Welcome</Heading>}
          {!isAuthenticated && (
            <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
              <Text as="span">Sign in </Text>
              <Link href="/signin">here</Link>
            </Text>
          )}
          {isAuthenticated && <Button onClick={handleSignOut}>Sign out</Button>}
        </Stack>
      </Center>
    </Container>
  );
}

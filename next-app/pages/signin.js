import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Center, Heading, Icon, Link, Text } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';

import { useAuth } from '../lib/authentication';
import { LoginForm } from '../components/LoginForm';

const Card = (props) => {
  return <Box boxShadow="xs" p="6" rounded="md" bg="white" {...props} />;
};

export default function Home() {
  const { isAuthenticated, signin } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      await signin({ email, password });
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <Container>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="An example chakra/nextjs frontend for keystone 6 | Sign In" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH="100vh" py="12" px={{ base: '4', lg: '8' }}>
        <Box maxW="md" mx="auto">
          <Center py={8}>
            <Icon boxSize="4em" as={FiUser} />
          </Center>
          <Heading textAlign="center" size="xl">
            Sign in to your account
          </Heading>
          <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
            <Text as="span">Don't have an account? </Text>
            <Link href="/signup">Sign up</Link>
          </Text>
          <Card>
            <LoginForm isLoading={loading} error={error} onSubmit={handleSubmit} />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

import React, { useState } from 'react';
import NextLink from 'next/link';
import { Button, chakra, FormControl, FormLabel, Input, Stack, Text } from '@chakra-ui/react';

export const LoginForm = ({ create, onSubmit, isLoading, error, ...props }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <chakra.form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ name, email, password });
      }}
      {...props}
    >
      <Stack spacing="6">
        {create && (
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              name="name"
              type="text"
              autoComplete="name"
              required
            />
          </FormControl>
        )}
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            name="password"
            type="password"
            required
          />
        </FormControl>
        {error && (
          <Text color="red" fontWeight="medium">
            {error}
          </Text>
        )}
        <Button isLoading={isLoading} type="submit" size="lg" fontSize="md">
          {create ? 'Create Account' : 'Sign in'}
        </Button>
        <NextLink href="/" passHref>
          <Button isDisabled={isLoading} colorScheme="gray" variant="outline" as="a" size="lg" fontSize="md">
            Cancel
          </Button>
        </NextLink>
      </Stack>
    </chakra.form>
  );
};

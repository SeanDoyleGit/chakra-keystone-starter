import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Center,
  Container,
  Heading,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Spinner,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react';
import { FiTrash } from 'react-icons/fi';

const AddTodo = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(value);
    setValue('');
  };

  return (
    <chakra.form onSubmit={handleSubmit}>
      <HStack>
        <Input value={value} onChange={(event) => setValue(event.target.value)}></Input>
        <Button px={6} type="submit" isDisabled={!value}>
          Add Todo
        </Button>
      </HStack>
    </chakra.form>
  );
};

const Todo = ({ id, label, onDelete }) => {
  return (
    <HStack>
      <IconButton onClick={() => onDelete(id)} colorScheme="red" aria-label="Delete todo" icon={<FiTrash />} />
      <Text fontSize="2xl">{label}</Text>
    </HStack>
  );
};

// Apollo Cache examples using a todo list
export default function ToDo() {
  const { data, loading, refetch } = useQuery(GET_TODOS);
  // const { data, loading, refetch } = useQuery(GET_TODOS, { context: { headers: { 'cache-control': 'max-age=0' } } });

  const [addTodo] = useMutation(ADD_TODO);
  const [removeTodo] = useMutation(REMOVE_TODO);

  // const [addTodo] = useMutation(ADD_TODO, {
  //   update: (cache, { data: createData }) => {
  //     const { todos } = cache.readQuery({
  //       query: GET_TODOS,
  //     });
  //     cache.writeQuery({
  //       data: { todos: todos.concat([createData.createTodo]) },
  //       query: GET_TODOS,
  //     });
  //   },
  // });

  // const [removeTodo] = useMutation(REMOVE_TODO, {
  //   update: (cache, { data: deleteData }) => {
  //     const { todos } = cache.readQuery({
  //       query: GET_TODOS,
  //     });
  //     cache.writeQuery({
  //       data: { todos: todos.filter((todo) => todo.id !== deleteData.deleteTodo.id) },
  //       query: GET_TODOS,
  //     });
  //   },
  // });

  const handleAddTodo = async (label) => {
    await addTodo({ variables: { label } });
    // await refetch();
    // await refetch({ fetchPolicy: 'network-only' });
  };

  const handleRemoveTodo = async (id) => {
    await removeTodo({ variables: { id } });
    // await refetch();
    // await refetch({ fetchPolicy: 'network-only' });
  };

  return (
    <Container>
      <Center height="100vh" pb={40}>
        <Stack>
          <Heading as="h1" textAlign="center">
            Todo
          </Heading>
          <List spacing={3}>
            {loading && <Spinner />}
            {!loading &&
              data?.todos?.map((todo) => (
                <ListItem key={todo.id}>
                  <Todo id={todo.id} label={todo.label} onDelete={handleRemoveTodo} />
                </ListItem>
              ))}
          </List>
          <AddTodo onSubmit={handleAddTodo} />
        </Stack>
      </Center>
    </Container>
  );
}

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      label
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($label: String!) {
    createTodo(data: { label: $label }) {
      id
      label
    }
  }
`;

const REMOVE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
    }
  }
`;

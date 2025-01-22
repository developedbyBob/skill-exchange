// src/components/Search/SearchBar.js
import { useState } from 'react';
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  Stack
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <InputGroup size="lg">
          <Input
            placeholder="Busque por habilidades (ex: Programação React, Design UI...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            borderRadius="full"
            bg="white"
            boxShadow="sm"
          />
          <InputRightElement>
            <IconButton
              type="submit"
              aria-label="Buscar"
              icon={<SearchIcon />}
              colorScheme="blue"
              borderRadius="full"
              size="sm"
              mr={2}
            />
          </InputRightElement>
        </InputGroup>
      </Stack>
    </Box>
  );
};

export default SearchBar;
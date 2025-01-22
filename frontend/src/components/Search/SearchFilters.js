// src/components/Search/SearchFilters.js
import {
  Box,
  Stack,
  Select,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';

const SearchFilters = ({ filters, onFilterChange }) => {
  const handleChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
      <Stack spacing={4}>
        <VStack align="stretch">
          <Text fontWeight="bold">Categoria</Text>
          <Select
            placeholder="Todas as categorias"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="Programação">Programação</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Idiomas">Idiomas</option>
            <option value="Música">Música</option>
            <option value="Outros">Outros</option>
          </Select>
        </VStack>

        <VStack align="stretch">
          <Text fontWeight="bold">Nível</Text>
          <Select
            placeholder="Todos os níveis"
            value={filters.level}
            onChange={(e) => handleChange('level', e.target.value)}
          >
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
            <option value="Especialista">Especialista</option>
          </Select>
        </VStack>

        <VStack align="stretch">
          <Text fontWeight="bold">Avaliação Mínima</Text>
          <HStack spacing={4}>
            <RangeSlider
              defaultValue={[0]}
              min={0}
              max={5}
              step={0.5}
              onChange={(val) => handleChange('minRating', val[0])}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
            <Text>{filters.minRating || 0}</Text>
          </HStack>
        </VStack>

        <Checkbox
          isChecked={filters.available}
          onChange={(e) => handleChange('available', e.target.checked)}
        >
          Apenas disponíveis
        </Checkbox>
      </Stack>
    </Box>
  );
};

export default SearchFilters;
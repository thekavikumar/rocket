import React from 'react';
import styled from 'styled-components';
import { Query, Theme } from '../types';

const SelectorContainer = styled.div`
  margin: 20px 0;
`;

const Select = styled.select<{ theme: Theme }>`
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  background: ${({ theme }) => (theme === 'dark' ? '#444' : '#fff')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  border: 1px solid #ccc;
`;

interface QuerySelectorProps {
  queries: Query[];
  onSelect: (query: Query) => void;
  theme: Theme;
}

export const QuerySelector = React.memo<QuerySelectorProps>(
  ({ queries, onSelect, theme }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = parseInt(e.target.value, 10);
      const selectedQuery = queries.find((q) => q.id === selectedId);
      if (selectedQuery) onSelect(selectedQuery);
    };

    return (
      <SelectorContainer>
        <Select
          onChange={handleChange}
          theme={theme}
          tabIndex={0}
          aria-label="Select a predefined query"
        >
          <option value="">Select a predefined query</option>
          {queries.map((query) => (
            <option key={query.id} value={query.id}>
              Query {query.id}: {query.text}
            </option>
          ))}
        </Select>
      </SelectorContainer>
    );
  }
);

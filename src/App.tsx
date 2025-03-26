import { useState } from 'react';
import styled from 'styled-components';
import QueryInput from './components/QueryInput';
import QuerySelector from './components/QuerySelector';
import ResultTable from './components/ResultTable';
import { Query, DataRow, Theme } from './types';

const AppContainer = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 25vh 60px 1fr; /* Adjusted to give table more flexible space */
  height: 100vh;
  padding: 20px;
  background: ${({ theme }) => (theme === 'dark' ? '#1a1a1a' : '#fff')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  transition: all 0.3s ease;
  overflow: hidden; /* Prevent app-level overflow */
`;

const ThemeToggle = styled.button<{ theme: Theme }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  background: ${({ theme }) => (theme === 'dark' ? '#444' : '#ddd')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const mockQueries: Query[] = [
  { id: 1, text: 'SELECT * FROM users', data: generateMockData(10000) },
  {
    id: 2,
    text: 'SELECT name, age FROM employees',
    data: generateMockData(5000),
  },
  { id: 3, text: 'SELECT email FROM customers', data: generateMockData(2000) },
];

function App() {
  const [selectedQuery, setSelectedQuery] = useState<Query>(mockQueries[0]);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomQuery(e.target.value);
  };

  const handleRunQuery = () => {
    if (customQuery.trim()) {
      const randomRowCount = Math.floor(Math.random() * 5000) + 100;
      setSelectedQuery({
        id: 0,
        text: customQuery,
        data: generateMockData(randomRowCount),
      });
    }
  };

  const handlePredefinedQuerySelect = (query: Query) => {
    setSelectedQuery(query);
    setCustomQuery('');
  };

  return (
    <AppContainer theme={theme}>
      <ThemeToggle theme={theme} onClick={toggleTheme}>
        Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
      </ThemeToggle>
      <QueryInput
        query={customQuery || selectedQuery.text}
        onQueryChange={handleQueryChange}
        onRunQuery={handleRunQuery}
        theme={theme}
      />
      <QuerySelector
        queries={mockQueries}
        onSelect={handlePredefinedQuerySelect}
        theme={theme}
      />
      <ResultTable data={selectedQuery.data} theme={theme} />
    </AppContainer>
  );
}

function generateMockData(rows: number): DataRow[] {
  return Array.from({ length: rows }, (_, i) => ({
    id: i + 1,
    name: `User${Math.random().toString(36).substring(2, 7)}`,
    age: Math.floor(Math.random() * 50) + 20,
    email: `user${Math.random().toString(36).substring(2, 7)}@example.com`,
  }));
}

export default App;

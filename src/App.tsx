import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Query, DataRow, Theme } from './types';
import { QueryInput } from './components/QueryInput';
import { QuerySelector } from './components/QuerySelector';
import { ResultTable } from './components/ResultTable';

const AppContainer = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 25vh 60px 1fr;
  height: 100vh;
  padding: 20px;
  background: ${({ theme }) => (theme === 'dark' ? '#1a1a1a' : '#fff')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  transition: all 0.3s ease;
  overflow: hidden;
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

const FlexBoss = styled.div<{ theme: Theme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExecTimeStyle = styled.p<{ theme: Theme }>`
  color: ${({ theme }) => (theme === 'dark' ? '#ccc' : '#333')};
  font-size: 14px;
`;

function generateMockData(rows: number): DataRow[] {
  return Array.from({ length: rows }, (_, i) => ({
    id: i + 1,
    name: `User${Math.random().toString(36).substring(2, 7)}`,
    age: Math.floor(Math.random() * 50) + 20,
    email: `user${Math.random().toString(36).substring(2, 7)}@example.com`,
  }));
}

const mockQueries: Query[] = [
  { id: 1, text: 'SELECT * FROM users', data: generateMockData(10000) },
  {
    id: 2,
    text: 'SELECT name, age FROM employees',
    data: generateMockData(5000),
  },
  { id: 3, text: 'SELECT email FROM customers', data: generateMockData(2000) },
];

export default function App() {
  const [selectedQuery, setSelectedQuery] = useState<Query>(mockQueries[0]);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('light');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Query cache
  const queryCache = useMemo(() => new Map<string, DataRow[]>(), []);

  // Load theme once on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Persist theme when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomQuery(e.target.value);
  };

  const handleRunQuery = () => {
    if (!customQuery.trim() || isLoading) return;

    setIsLoading(true);
    const startTime = performance.now();

    // Check cache first
    const cachedResult = queryCache.get(customQuery);
    if (cachedResult) {
      setSelectedQuery({
        id: 0,
        text: customQuery,
        data: cachedResult,
      });
      setExecutionTime(performance.now() - startTime);
      setIsLoading(false);
    } else {
      // Simulate async operation
      setTimeout(() => {
        const randomRowCount = Math.floor(Math.random() * 5000) + 100;
        const newData = generateMockData(randomRowCount);
        queryCache.set(customQuery, newData);
        setSelectedQuery({
          id: 0,
          text: customQuery,
          data: newData,
        });
        setExecutionTime(performance.now() - startTime);
        setIsLoading(false);
      }, 500); // Simulated delay
    }
  };

  const handlePredefinedQuerySelect = (query: Query) => {
    setSelectedQuery(query);
    setCustomQuery('');
    setExecutionTime(null);
  };

  return (
    <AppContainer theme={theme}>
      <ThemeToggle
        theme={theme}
        onClick={toggleTheme}
        tabIndex={0}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
      </ThemeToggle>
      <QueryInput
        query={customQuery || selectedQuery.text}
        onQueryChange={handleQueryChange}
        onRunQuery={handleRunQuery}
        theme={theme}
        isLoading={isLoading}
      />
      <FlexBoss theme={theme}>
        <QuerySelector
          queries={mockQueries}
          onSelect={handlePredefinedQuerySelect}
          theme={theme}
        />
        {executionTime !== null && (
          <ExecTimeStyle theme={theme}>
            Execution Time: {executionTime.toFixed(2)} ms
          </ExecTimeStyle>
        )}
      </FlexBoss>
      <ResultTable data={selectedQuery.data} theme={theme} />
    </AppContainer>
  );
}

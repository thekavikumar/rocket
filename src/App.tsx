import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { QueryInput } from './components/QueryInput';
import { QuerySelector } from './components/QuerySelector';
import { ResultTable } from './components/ResultTable';
import { Query, DataRow, Theme } from './types';

const AppContainer = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 25vh 60px 1fr;
  height: 100vh;
  padding: 20px;
  background: ${({ theme }) => (theme === 'dark' ? '#1a1a1a' : '#fff')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
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

const HistorySidebar = styled.div<{ theme: Theme; isopen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: ${({ theme }) => (theme === 'dark' ? '#2a2a2a' : '#f9f9f9')};
  border-left: 1px solid #ccc;
  padding: 20px;
  transform: translateX(${({ isopen }) => (isopen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 10;
  overflow-y: auto;
  box-shadow: ${({ isopen }) =>
    isopen ? '-2px 0 10px rgba(0,0,0,0.2)' : 'none'};
`;

const CloseHistoryButton = styled.button<{ theme: Theme }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  background: ${({ theme }) => (theme === 'dark' ? '#555' : '#007bff')};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const HistoryToggle = styled.button<{ theme: Theme }>`
  position: absolute;
  top: 50px;
  right: 10px;
  padding: 6px 12px;
  background: ${({ theme }) => (theme === 'dark' ? '#555' : '#007bff')};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 5;
`;

const HistoryItem = styled.div<{ theme: Theme }>`
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  background: ${({ theme }) => (theme === 'dark' ? '#333' : '#f1f1f1')};
  border-radius: 4px;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => (theme === 'dark' ? '#444' : '#ddd')};
  }
`;

const HistoryTitle = styled.h4<{ theme: Theme }>`
  margin: 0 0 15px 0;
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
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
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataRow | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const queryCache = useMemo(() => new Map<string, DataRow[]>(), []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomQuery(e.target.value);
  };

  const handleRunQuery = () => {
    if (!customQuery.trim() || isLoading) return;

    setIsLoading(true);
    const startTime = performance.now();

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
        setQueryHistory((prev) =>
          [customQuery, ...prev.filter((q) => q !== customQuery)].slice(0, 10)
        );
        setIsLoading(false);
      }, 500);
    }
  };

  const handlePredefinedQuerySelect = (query: Query) => {
    setSelectedQuery(query);
    setCustomQuery('');
    setExecutionTime(null);
  };

  const handleHistorySelect = (query: string) => {
    setCustomQuery(query);
    handleRunQuery();
    setIsHistoryOpen(false);
  };

  const sortedData = useMemo(() => {
    const data = [...selectedQuery.data];
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [selectedQuery.data, sortConfig]);

  const requestSort = (key: keyof DataRow) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <AppContainer theme={theme}>
      <ThemeToggle
        theme={theme}
        onClick={toggleTheme}
        tabIndex={0}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        Toggle {theme === 'light' ? 'Dark' : '-Light'} Mode
      </ThemeToggle>
      <HistoryToggle
        theme={theme}
        onClick={toggleHistory}
        tabIndex={0}
        aria-label={`Open query history`}
      >
        Show Recent Queries
      </HistoryToggle>
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
      <HistorySidebar theme={theme} isopen={isHistoryOpen}>
        <CloseHistoryButton
          theme={theme}
          onClick={() => setIsHistoryOpen(false)}
          aria-label="Close query history"
        >
          Close
        </CloseHistoryButton>
        <HistoryTitle theme={theme}>Recent Queries</HistoryTitle>
        {queryHistory.length === 0 ? (
          <p>No recent queries yet</p>
        ) : (
          queryHistory.map((query, index) => (
            <HistoryItem
              key={index}
              theme={theme}
              onClick={() => handleHistorySelect(query)}
              tabIndex={0}
              aria-label={`Re-run query: ${query}`}
            >
              {query}
            </HistoryItem>
          ))
        )}
      </HistorySidebar>
      <ResultTable
        data={sortedData}
        theme={theme}
        onSort={requestSort}
        sortConfig={sortConfig}
      />
    </AppContainer>
  );
}

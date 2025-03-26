import styled from 'styled-components';
import { Theme } from '../types';

const InputContainer = styled.div<{ theme: Theme }>`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background: ${({ theme }) => (theme === 'dark' ? '#2a2a2a' : '#f9f9f9')};
  display: flex;
  flex-direction: column;
`;

const QueryTextArea = styled.textarea<{ theme: Theme }>`
  width: 100%;
  height: 80%;
  border: none;
  resize: none;
  font-family: 'Courier New', Courier, monospace;
  background: transparent;
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  &:focus {
    outline: none;
  }
`;

const RunButton = styled.button<{ theme: Theme }>`
  margin-top: 10px;
  padding: 8px 16px;
  background: ${({ theme }) => (theme === 'dark' ? '#555' : '#007bff')};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
  &:hover {
    background: ${({ theme }) => (theme === 'dark' ? '#666' : '#0056b3')};
  }
`;

interface QueryInputProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onRunQuery: () => void;
  theme: Theme;
}

const QueryInput: React.FC<QueryInputProps> = ({
  query,
  onQueryChange,
  onRunQuery,
  theme,
}) => {
  return (
    <InputContainer theme={theme}>
      <QueryTextArea
        value={query}
        onChange={onQueryChange}
        placeholder="Type your SQL query here..."
        theme={theme}
      />
      <RunButton theme={theme} onClick={onRunQuery}>
        Run Query
      </RunButton>
    </InputContainer>
  );
};

export default QueryInput;

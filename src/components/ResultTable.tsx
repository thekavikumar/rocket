import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { saveAs } from 'file-saver';
import { DataRow, Theme } from '../types';

const TableContainer = styled.div<{ theme: Theme }>`
  border: 1px solid #ccc;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => (theme === 'dark' ? '#2a2a2a' : '#fff')};
`;

const HeaderRow = styled.div<{ theme: Theme }>`
  display: flex;
  background: ${({ theme }) => (theme === 'dark' ? '#333' : '#f1f1f1')};
  border-bottom: 1px solid #ccc;
`;

const Row = styled.div<{ theme: Theme }>`
  display: flex;
  border-bottom: 1px solid
    ${({ theme }) => (theme === 'dark' ? '#444' : '#eee')};
`;

const Cell = styled.div<{ theme: Theme }>`
  flex: 1;
  padding: 8px;
  text-align: center;
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
`;

const ExportButton = styled.button<{ theme: Theme }>`
  margin: 10px;
  padding: 8px 16px;
  background: ${({ theme }) => (theme === 'dark' ? '#444' : '#ddd')};
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface ResultTableProps {
  data: DataRow[];
  theme: Theme;
}

const ResultTable: React.FC<ResultTableProps> = ({ data, theme }) => {
  const RowRenderer = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <Row style={style} theme={theme}>
      <Cell theme={theme}>{data[index].id}</Cell>
      <Cell theme={theme}>{data[index].name}</Cell>
      <Cell theme={theme}>{data[index].age}</Cell>
      <Cell theme={theme}>{data[index].email}</Cell>
    </Row>
  );

  const exportToCSV = () => {
    const csv = [
      'id,name,age,email',
      ...data.map((row) => `${row.id},${row.name},${row.age},${row.email}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'query_result.csv');
  };

  return (
    <TableContainer theme={theme}>
      <HeaderRow theme={theme}>
        <Cell theme={theme}>ID</Cell>
        <Cell theme={theme}>Name</Cell>
        <Cell theme={theme}>Age</Cell>
        <Cell theme={theme}>Email</Cell>
      </HeaderRow>
      <FixedSizeList
        height={400}
        width="100%"
        itemCount={data.length}
        itemSize={35}
      >
        {RowRenderer}
      </FixedSizeList>
      <ExportButton onClick={exportToCSV} theme={theme}>
        Export to CSV
      </ExportButton>
    </TableContainer>
  );
};

export default ResultTable;

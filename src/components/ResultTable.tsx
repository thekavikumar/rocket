import React from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { saveAs } from 'file-saver';
import { DataRow, Theme } from '../types';

const TableContainer = styled.div<{ theme: Theme }>`
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => (theme === 'dark' ? '#2a2a2a' : '#fff')};
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
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

const HeaderCell = styled(Cell)<{ theme: Theme; sortable?: string }>`
  cursor: ${({ sortable }) => (sortable === 'true' ? 'pointer' : 'default')};
  user-select: none;
  position: relative;
`;

const SortIndicator = styled.span<{ direction: 'asc' | 'desc' }>`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
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
  onSort: (key: keyof DataRow) => void;
  sortConfig: { key: keyof DataRow | null; direction: 'asc' | 'desc' };
}

export const ResultTable = React.memo<ResultTableProps>(
  ({ data, theme, onSort, sortConfig }) => {
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

    const getSortIndicator = (key: keyof DataRow) => {
      if (sortConfig.key === key) {
        return (
          <SortIndicator direction={sortConfig.direction}>
            {sortConfig.direction === 'asc' ? '▲' : '▼'}
          </SortIndicator>
        );
      }
      return null;
    };

    return (
      <TableContainer theme={theme}>
        <HeaderRow theme={theme}>
          <HeaderCell
            theme={theme}
            sortable="true"
            onClick={() => onSort('id')}
          >
            ID {getSortIndicator('id')}
          </HeaderCell>
          <HeaderCell
            theme={theme}
            sortable="true"
            onClick={() => onSort('name')}
          >
            Name {getSortIndicator('name')}
          </HeaderCell>
          <HeaderCell
            theme={theme}
            sortable="true"
            onClick={() => onSort('age')}
          >
            Age {getSortIndicator('age')}
          </HeaderCell>
          <HeaderCell
            theme={theme}
            sortable="true"
            onClick={() => onSort('email')}
          >
            Email {getSortIndicator('email')}
          </HeaderCell>
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
  }
);

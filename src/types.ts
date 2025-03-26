export interface Query {
  id: number;
  text: string;
  data: DataRow[];
}

export interface DataRow {
  id: number;
  name: string;
  age: number;
  email: string;
}

// Define the theme type
export type Theme = 'light' | 'dark';

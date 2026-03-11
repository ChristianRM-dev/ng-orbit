import type { OrbitTableQuery } from '@ng-orbit/table';

export interface DemoPersonRow {
  id: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  country: string;
}

export interface DemoTableResponse {
  rows: DemoPersonRow[];
  total: number;
}

export interface DemoQueryResult {
  query: OrbitTableQuery;
  response: DemoTableResponse;
}

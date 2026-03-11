import { Injectable } from '@angular/core';
import type { OrbitTableQuery } from '@ng-orbit/table';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import type { DemoPersonRow, DemoTableResponse } from './table-demo.types';

const NETWORK_DELAY_MS = 380;

@Injectable({ providedIn: 'root' })
export class TableDemoDataService {
  private readonly allRows: readonly DemoPersonRow[] = createMockRows();

  fetch(query: OrbitTableQuery): Observable<DemoTableResponse> {
    const normalizedSearch = query.search.trim().toLowerCase();

    return timer(NETWORK_DELAY_MS).pipe(
      switchMap(() => {
        if (normalizedSearch === 'error') {
          return throwError(() => new Error('Simulated network error for demo.'));
        }

        const baseRows = normalizedSearch === 'empty'
          ? []
          : this.applySearch(this.allRows, normalizedSearch);
        const sortedRows = this.applySort(baseRows, query);
        const paginatedRows = this.applyPagination(sortedRows, query);

        return of({
          rows: paginatedRows,
          total: sortedRows.length
        });
      })
    );
  }

  private applySearch(rows: readonly DemoPersonRow[], search: string): DemoPersonRow[] {
    if (!search) {
      return [...rows];
    }

    return rows.filter((row) => {
      const searchableText = `${row.fullName} ${row.email} ${row.role} ${row.country}`.toLowerCase();
      return searchableText.includes(search);
    });
  }

  private applySort(rows: readonly DemoPersonRow[], query: OrbitTableQuery): DemoPersonRow[] {
    const sort = query.sort;
    const activeId = sort?.activeId;
    if (!sort || !activeId || !sort.direction) {
      return [...rows];
    }

    const direction = sort.direction === 'asc' ? 1 : -1;

    return [...rows].sort((left, right) => {
      const leftValue = this.resolveSortValue(left, activeId);
      const rightValue = this.resolveSortValue(right, activeId);

      if (leftValue < rightValue) {
        return -1 * direction;
      }
      if (leftValue > rightValue) {
        return 1 * direction;
      }
      return 0;
    });
  }

  private resolveSortValue(row: DemoPersonRow, activeId: string): string | number {
    switch (activeId) {
      case 'id':
        return row.id;
      case 'fullName':
        return row.fullName;
      case 'email':
        return row.email;
      case 'role':
        return row.role;
      case 'country':
        return row.country;
      default:
        return row.id;
    }
  }

  private applyPagination(rows: readonly DemoPersonRow[], query: OrbitTableQuery): DemoPersonRow[] {
    const page = Math.max(1, Math.trunc(query.page));
    const pageSize = Math.max(1, Math.trunc(query.pageSize));
    const start = (page - 1) * pageSize;

    return rows.slice(start, start + pageSize);
  }
}

function createMockRows(): DemoPersonRow[] {
  const roles: readonly DemoPersonRow['role'][] = ['Admin', 'Editor', 'Viewer'];
  const countries = ['Canada', 'Spain', 'Mexico', 'United States', 'Chile', 'Argentina'];

  return Array.from({ length: 72 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      fullName: `Person ${id}`,
      email: `person${id}@example.com`,
      role: roles[index % roles.length],
      country: countries[index % countries.length]
    };
  });
}

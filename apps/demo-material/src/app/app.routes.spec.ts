import { appRoutes } from './app.routes';

describe('app routes', () => {
  it('includes material routes for table and wizard placeholder', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    expect(rootRoute).toBeTruthy();

    const childPaths = (rootRoute?.children ?? []).map((route) => route.path);
    expect(childPaths).toContain('table/material');
    expect(childPaths).toContain('wizard/material');
  });
});

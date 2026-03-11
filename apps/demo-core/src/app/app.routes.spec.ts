import { appRoutes } from './app.routes';

describe('app routes', () => {
  it('includes local and remote table routes', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    expect(rootRoute).toBeTruthy();

    const childPaths = (rootRoute?.children ?? []).map((route) => route.path);
    expect(childPaths).toContain('table/core');
    expect(childPaths).toContain('table/plain');
    expect(childPaths).toContain('table/material');
    expect(childPaths).toContain('table/daisy');
    expect(childPaths).toContain('wizard/core');
    expect(childPaths).toContain('wizard/material');
    expect(childPaths).toContain('wizard/daisy');
  });
});

import { appRoutes } from './app.routes';

describe('app routes', () => {
  it('includes canonical docs routes and legacy aliases', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    expect(rootRoute).toBeTruthy();

    const childRoutes = rootRoute?.children ?? [];
    const childPaths = childRoutes.map((route) => route.path);

    expect(childPaths).toContain('table');
    expect(childPaths).toContain('wizard');
    expect(childPaths).toContain('table/core');
    expect(childPaths).toContain('table/plain');
    expect(childPaths).toContain('table/material');
    expect(childPaths).toContain('table/daisy');
    expect(childPaths).toContain('wizard/core');
    expect(childPaths).toContain('wizard/material');
    expect(childPaths).toContain('wizard/daisy');
  });

  it('maps legacy core routes to the custom docs renderer', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    const tableCoreRoute = rootRoute?.children?.find((route) => route.path === 'table/core');
    const wizardCoreRoute = rootRoute?.children?.find((route) => route.path === 'wizard/core');

    expect(tableCoreRoute?.data?.['renderer']).toBe('custom');
    expect(wizardCoreRoute?.data?.['renderer']).toBe('custom');
  });
});

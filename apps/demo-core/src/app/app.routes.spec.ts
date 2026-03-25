import { appRoutes } from './app.routes';

describe('app routes', () => {
  it('includes canonical docs paths and legacy aliases', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    expect(rootRoute).toBeTruthy();

    const childRoutes = rootRoute?.children ?? [];
    const childPaths = childRoutes.map((route) => route.path);

    expect(childPaths).toContain('home');
    expect(childPaths).toContain('table/overview');
    expect(childPaths).toContain('table/api');
    expect(childPaths).toContain('table/renders/plain');
    expect(childPaths).toContain('table/examples/renderer-swap');
    expect(childPaths).toContain('wizard/overview');
    expect(childPaths).toContain('wizard/api');
    expect(childPaths).toContain('wizard/renders/material');
    expect(childPaths).toContain('wizard/examples/renderer-integration');
    expect(childPaths).toContain('notify/overview');
    expect(childPaths).toContain('notify/api');
    expect(childPaths).toContain('notify/renders/plain');
    expect(childPaths).toContain('notify/examples/success-toast');
    expect(childPaths).toContain('adapters/overview');
    expect(childPaths).toContain('adapters/api');
    expect(childPaths).toContain('adapters/patterns/full-renderer');
    expect(childPaths).toContain('adapters/examples/wizard-form-sync');
    expect(childPaths).toContain('table');
    expect(childPaths).toContain('wizard');
    expect(childPaths).toContain('notify');
    expect(childPaths).toContain('adapters');
    expect(childPaths).toContain('table/core');
    expect(childPaths).toContain('table/plain');
    expect(childPaths).toContain('table/material');
    expect(childPaths).toContain('table/daisy');
    expect(childPaths).toContain('wizard/core');
    expect(childPaths).toContain('wizard/material');
    expect(childPaths).toContain('wizard/daisy');
    expect(childPaths).toContain('notify/plain');
  });

  it('redirects the empty path and wildcard path to home', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    const defaultRoute = rootRoute?.children?.find((route) => route.path === '');
    const wildcardRoute = rootRoute?.children?.find((route) => route.path === '**');

    expect(defaultRoute?.redirectTo).toBe('home');
    expect(defaultRoute?.pathMatch).toBe('full');
    expect(wildcardRoute?.redirectTo).toBe('home');
  });

  it('maps legacy core routes to the custom docs renderer', () => {
    const rootRoute = appRoutes.find((route) => route.path === '');
    const tableCoreRoute = rootRoute?.children?.find((route) => route.path === 'table/core');
    const wizardCoreRoute = rootRoute?.children?.find((route) => route.path === 'wizard/core');

    expect(tableCoreRoute?.data?.['renderer']).toBe('custom');
    expect(wizardCoreRoute?.data?.['renderer']).toBe('custom');
    expect(tableCoreRoute?.data?.['docsTab']).toBe('renders');
    expect(wizardCoreRoute?.data?.['docsTab']).toBe('renders');
  });
});

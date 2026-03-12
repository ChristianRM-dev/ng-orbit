import { appRoutes } from './app.routes';

describe('app routes', () => {
  it('includes material routes for table and wizard placeholder', () => {
    const paths = appRoutes.map((route) => route.path);
    expect(paths).toContain('table/material');
    expect(paths).toContain('wizard/material');
  });
});

import { appRoutes } from './app.routes';

describe('app routes', () => {
  it('includes daisy routes for table and wizard', () => {
    const paths = appRoutes.map((route) => route.path);
    expect(paths).toContain('table/daisy');
    expect(paths).toContain('wizard/daisy');
  });
});

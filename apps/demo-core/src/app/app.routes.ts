import { Routes } from '@angular/router';
import { DOCS_FEATURES, getTabRouteSegment, type DocsFeatureId } from './features/docs/docs.catalog';

const tableFeatureRoutes = buildFeatureRoutes('table');
const wizardFeatureRoutes = buildFeatureRoutes('wizard');
const notifyFeatureRoutes = buildFeatureRoutes('notify');
const adaptersFeatureRoutes = buildFeatureRoutes('adapters');

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/demo-shell.component').then((module) => module.DemoShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home-page.component').then((module) => module.HomePageComponent)
      },
      ...tableFeatureRoutes,
      ...wizardFeatureRoutes,
      ...notifyFeatureRoutes,
      ...adaptersFeatureRoutes,
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

function buildFeatureRoutes(featureId: DocsFeatureId): Routes {
  const { feature, renderIds, exampleIds, legacyRenderAliases } = DOCS_FEATURES[featureId];
  const loadComponent = getFeatureLoader(featureId);
  const renderSegment = getTabRouteSegment(feature, 'renders');
  const exampleSegment = getTabRouteSegment(feature, 'examples');

  const legacyRoutes = Object.entries(legacyRenderAliases ?? {}).map(([legacyPath, renderer]) => ({
    path: `${feature.routePath}/${legacyPath}`,
    loadComponent,
    data: {
      docsTab: 'renders',
      renderer,
      legacy: true
    }
  }));

  return [
    {
      path: feature.routePath,
      loadComponent,
      data: {
        legacy: true
      }
    },
    {
      path: `${feature.routePath}/overview`,
      loadComponent,
      data: {
        docsTab: 'overview'
      }
    },
    {
      path: `${feature.routePath}/api`,
      loadComponent,
      data: {
        docsTab: 'api'
      }
    },
    {
      path: `${feature.routePath}/${renderSegment}`,
      loadComponent,
      data: {
        docsTab: 'renders',
        legacy: true
      }
    },
    ...renderIds.map((rendererId) => ({
      path: `${feature.routePath}/${renderSegment}/${rendererId}`,
      loadComponent,
      data: {
        docsTab: 'renders',
        renderer: rendererId
      }
    })),
    {
      path: `${feature.routePath}/${exampleSegment}`,
      loadComponent,
      data: {
        docsTab: 'examples',
        legacy: true
      }
    },
    ...exampleIds.map((exampleId) => ({
      path: `${feature.routePath}/${exampleSegment}/${exampleId}`,
      loadComponent,
      data: {
        docsTab: 'examples',
        example: exampleId
      }
    })),
    ...legacyRoutes
  ];
}

function getFeatureLoader(featureId: DocsFeatureId) {
  switch (featureId) {
    case 'table':
      return () =>
        import('./features/hub/table-hub-page.component').then(
          (module) => module.TableHubPageComponent
        );
    case 'wizard':
      return () =>
        import('./features/hub/wizard-hub-page.component').then(
          (module) => module.WizardHubPageComponent
        );
    case 'notify':
      return () =>
        import('./features/hub/notify-hub-page.component').then(
          (module) => module.NotifyHubPageComponent
        );
    case 'adapters':
      return () =>
        import('./features/hub/adapters-hub-page.component').then(
          (module) => module.AdaptersHubPageComponent
        );
  }
}

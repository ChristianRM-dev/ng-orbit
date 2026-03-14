import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/demo-shell.component').then((module) => module.DemoShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'table'
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./features/hub/table-hub-page.component').then(
            (module) => module.TableHubPageComponent
          )
      },
      {
        path: 'wizard',
        loadComponent: () =>
          import('./features/hub/wizard-hub-page.component').then(
            (module) => module.WizardHubPageComponent
          )
      },
      // Legacy aliases. These routes keep old URLs working while canonical routes
      // are `/table?renderer=...` and `/wizard?renderer=...`.
      {
        path: 'table/core',
        loadComponent: () =>
          import('./features/hub/table-hub-page.component').then(
            (module) => module.TableHubPageComponent
          ),
        data: {
          renderer: 'custom'
        }
      },
      {
        path: 'table/plain',
        loadComponent: () =>
          import('./features/hub/table-hub-page.component').then(
            (module) => module.TableHubPageComponent
          ),
        data: {
          renderer: 'plain'
        }
      },
      {
        path: 'table/material',
        loadComponent: () =>
          import('./features/hub/table-hub-page.component').then(
            (module) => module.TableHubPageComponent
          ),
        data: {
          renderer: 'material'
        }
      },
      {
        path: 'table/daisy',
        loadComponent: () =>
          import('./features/hub/table-hub-page.component').then(
            (module) => module.TableHubPageComponent
          ),
        data: {
          renderer: 'daisy'
        }
      },
      {
        path: 'wizard/core',
        loadComponent: () =>
          import('./features/hub/wizard-hub-page.component').then(
            (module) => module.WizardHubPageComponent
          ),
        data: {
          renderer: 'custom'
        }
      },
      {
        path: 'wizard/material',
        loadComponent: () =>
          import('./features/hub/wizard-hub-page.component').then(
            (module) => module.WizardHubPageComponent
          ),
        data: {
          renderer: 'material'
        }
      },
      {
        path: 'wizard/daisy',
        loadComponent: () =>
          import('./features/hub/wizard-hub-page.component').then(
            (module) => module.WizardHubPageComponent
          ),
        data: {
          renderer: 'daisy'
        }
      },
      {
        path: '**',
        redirectTo: 'table'
      }
    ]
  }
];

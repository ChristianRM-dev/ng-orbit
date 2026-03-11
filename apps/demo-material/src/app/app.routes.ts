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
        redirectTo: 'table/material'
      },
      {
        path: 'table/material',
        loadComponent: () =>
          import('./features/table/table-material-page.component').then(
            (module) => module.TableMaterialPageComponent
          )
      },
      {
        path: 'wizard/material',
        loadComponent: () =>
          import('./features/wizard/wizard-material-placeholder-page.component').then(
            (module) => module.WizardMaterialPlaceholderPageComponent
          )
      },
      {
        path: '**',
        redirectTo: 'table/material'
      }
    ]
  }
];

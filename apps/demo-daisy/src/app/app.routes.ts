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
        redirectTo: 'table/daisy'
      },
      {
        path: 'table/daisy',
        loadComponent: () =>
          import('./features/table/table-daisy-page.component').then(
            (module) => module.TableDaisyPageComponent
          )
      },
      {
        path: 'wizard/daisy',
        loadComponent: () =>
          import('./features/wizard/wizard-daisy-placeholder-page.component').then(
            (module) => module.WizardDaisyPlaceholderPageComponent
          )
      },
      {
        path: '**',
        redirectTo: 'table/daisy'
      }
    ]
  }
];

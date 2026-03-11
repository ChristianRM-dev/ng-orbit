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
        redirectTo: 'table/plain'
      },
      {
        path: 'table/core',
        loadComponent: () =>
          import('./features/table/table-core-page.component').then(
            (module) => module.TableCorePageComponent
          )
      },
      {
        path: 'table/plain',
        loadComponent: () =>
          import('./features/table/table-plain-page.component').then(
            (module) => module.TablePlainPageComponent
          )
      },
      {
        path: 'table/material',
        loadComponent: () =>
          import('./features/remote/remote-iframe-page.component').then(
            (module) => module.RemoteIframePageComponent
          ),
        data: {
          remoteName: 'demo-material',
          remotePath: '/table/material',
          titleKey: 'table.pages.materialTitle',
          subtitleKey: 'table.pages.materialSubtitle'
        }
      },
      {
        path: 'table/daisy',
        loadComponent: () =>
          import('./features/remote/remote-iframe-page.component').then(
            (module) => module.RemoteIframePageComponent
          ),
        data: {
          remoteName: 'demo-daisy',
          remotePath: '/table/daisy',
          titleKey: 'table.pages.daisyTitle',
          subtitleKey: 'table.pages.daisySubtitle'
        }
      },
      {
        path: 'wizard/core',
        loadComponent: () =>
          import('./features/wizard/wizard-placeholder-page.component').then(
            (module) => module.WizardPlaceholderPageComponent
          ),
        data: {
          titleKey: 'wizard.pages.coreTitle',
          subtitleKey: 'wizard.pages.coreSubtitle'
        }
      },
      {
        path: 'wizard/material',
        loadComponent: () =>
          import('./features/remote/remote-iframe-page.component').then(
            (module) => module.RemoteIframePageComponent
          ),
        data: {
          remoteName: 'demo-material',
          remotePath: '/wizard/material',
          titleKey: 'wizard.pages.materialTitle',
          subtitleKey: 'wizard.pages.materialSubtitle'
        }
      },
      {
        path: 'wizard/daisy',
        loadComponent: () =>
          import('./features/remote/remote-iframe-page.component').then(
            (module) => module.RemoteIframePageComponent
          ),
        data: {
          remoteName: 'demo-daisy',
          remotePath: '/wizard/daisy',
          titleKey: 'wizard.pages.daisyTitle',
          subtitleKey: 'wizard.pages.daisySubtitle'
        }
      },
      {
        path: '**',
        redirectTo: 'table/plain'
      }
    ]
  }
];

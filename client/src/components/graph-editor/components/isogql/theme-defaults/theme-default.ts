import { registerExtension } from 'vscode/extensions';

const manifest = {
  name: 'theme-defaults',
  displayName: 'Default Themes',
  description: 'The default Visual Studio light and dark themes',
  categories: ['Themes'],
  version: '1.0.0',
  publisher: 'vscode',
  license: 'MIT',
  engines: { vscode: '*' },
  contributes: {
    themes: [
      {
        id: 'Default Dark+',
        label: 'Dark+',
        uiTheme: 'vs-dark',
        path: './themes/dark_plus.json',
      },
      {
        id: 'Default Dark Modern',
        label: 'Dark Modern',
        uiTheme: 'vs-dark',
        path: './themes/dark_modern.json',
      },
      {
        id: 'Default Light+',
        label: 'Light+',
        uiTheme: 'vs',
        path: './themes/light_plus.json',
      },
      {
        id: 'Default Light Modern',
        label: 'Light Modern',
        uiTheme: 'vs',
        path: './themes/light_modern.json',
      },
      {
        id: 'Visual Studio Dark',
        label: 'Dark (Visual Studio)',
        uiTheme: 'vs-dark',
        path: './themes/dark_vs.json',
      },
      {
        id: 'Visual Studio Light',
        label: 'Light (Visual Studio)',
        uiTheme: 'vs',
        path: './themes/light_vs.json',
      },
      {
        id: 'Default High Contrast',
        label: 'Dark High Contrast',
        uiTheme: 'hc-black',
        path: './themes/hc_black.json',
      },
      {
        id: 'Default High Contrast Light',
        label: 'Light High Contrast',
        uiTheme: 'hc-light',
        path: './themes/hc_light.json',
      },
    ],
    iconThemes: [
      {
        id: 'vs-minimal',
        label: 'Minimal (Visual Studio Code)',
        path: './fileicons/vs_minimal-icon-theme.json',
      },
    ],
  },
  repository: { type: 'git', url: 'https://github.com/microsoft/vscode.git' },
};

const { registerFileUrl } = registerExtension(manifest);

registerFileUrl(
  './themes/dark_plus.json',
  new URL('./theme-defaults/dark_plus.json', import.meta.url).toString(),
);

registerFileUrl(
  './themes/dark_modern.json',
  new URL('./theme-defaults/dark_modern.json', import.meta.url).toString(),
);

registerFileUrl(
  './themes/light_plus.json',
  new URL('./theme-defaults/light_plus.json', import.meta.url).toString(),
);

registerFileUrl(
  './themes/light_modern.json',
  new URL('./theme-defaults/light_modern.json', import.meta.url).toString(),
);

registerFileUrl(
  './themes/dark_vs.json',
  new URL('./theme-defaults/dark_vs.json', import.meta.url).toString(),
);

registerFileUrl(
  './themes/light_vs.json',
  new URL('./theme-defaults/light_vs.json', import.meta.url).toString(),
);

registerFileUrl(
  './themes/hc_black.json',
  new URL('./theme-defaults/hc_black.json', import.meta.url).toString(),
);

registerFileUrl(
  './themes/hc_light.json',
  new URL('./theme-defaults/hc_light.json', import.meta.url).toString(),
);

registerFileUrl(
  './fileicons/vs_minimal-icon-theme.json',
  new URL(
    './theme-defaults/vs_minimal-icon-theme.json',
    import.meta.url,
  ).toString(),
);

registerFileUrl(
  'fileicons/images/root-folder-dark.svg',
  new URL('./theme-defaults/root-folder-dark.svg', import.meta.url).toString(),
);

registerFileUrl(
  'fileicons/images/root-folder-open-dark.svg',
  new URL(
    './theme-defaults/root-folder-open-dark.svg',
    import.meta.url,
  ).toString(),
);

registerFileUrl(
  'fileicons/images/folder-dark.svg',
  new URL('./theme-defaults/folder-dark.svg', import.meta.url).toString(),
);

registerFileUrl(
  'fileicons/images/folder-open-dark.svg',
  new URL('./theme-defaults/folder-open-dark.svg', import.meta.url).toString(),
);

registerFileUrl(
  'fileicons/images/document-dark.svg',
  new URL('./theme-defaults/document-dark.svg', import.meta.url).toString(),
);

registerFileUrl(
  'fileicons/images/root-folder-light.svg',
  new URL('./theme-defaults/root-folder-light.svg', import.meta.url).toString(),
);

registerFileUrl(
  'fileicons/images/root-folder-open-light.svg',
  new URL(
    './theme-defaults/root-folder-open-light.svg',
    import.meta.url,
  ).toString(),
);

registerFileUrl(
  'fileicons/images/folder-light.svg',
  new URL('./theme-defaults/folder-light.svg', import.meta.url).toString(),
);

registerFileUrl(
  'fileicons/images/folder-open-light.svg',
  new URL('./theme-defaults/folder-open-light.svg', import.meta.url).toString(),
);

registerFileUrl(
  'fileicons/images/document-light.svg',
  new URL('./theme-defaults/document-light.svg', import.meta.url).toString(),
);

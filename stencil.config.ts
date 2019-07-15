import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  outputTargets: [{
    type: 'www',
    serviceWorker: {
      globPatterns: [
        '**/*.{js,css,json,html,ico,png}'
      ]
    }
  }],
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  copy: [
    { src: 'robots.txt' }
  ]
};

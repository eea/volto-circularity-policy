import * as eea from '@eeacms/volto-eea-website-theme/config';
import { runtimeConfig } from '@plone/volto/runtime_config';
import StagingBanner from './StagingBanner';
import './less/slate-metadata.less';

const applyConfig = (config) => {
  config.settings.eea = {
    ...eea,
    ...(config.settings.eea || {}),
  };

  // #137187 Keycloak integration
  if (runtimeConfig['RAZZLE_KEYCLOAK'] === 'Yes') {
    config.settings.externalRoutes = [
      ...(config.settings.externalRoutes || []),
      {
        match: {
          path: '/login',
          exact: true,
          strict: false,
        },
      },
      {
        match: {
          path: '/logout',
          exact: true,
          strict: false,
        },
      },
    ];
  }
  // Volto banner
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '',
      component: StagingBanner,
    },
  ];

  config.settings.eea.headerSearchBox = [
    {
      isDefault: true,
      path: '/advanced-search',
      placeholder: 'Search...',
    },
    {
      path: '/datahub',
      placeholder: 'Search Datahub...',
      description:
        'Looking for more information? Try searching the full EEA website content',
      buttonTitle: 'Go to full site search',
    },
  ];

  return config;
};

export default applyConfig;

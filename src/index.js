import * as eea from '@eeacms/volto-eea-website-theme/config';
import { runtimeConfig } from '@plone/volto/runtime_config';
import StagingBanner from './StagingBanner';

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

  return config;
};

export default applyConfig;

import * as eea from '@eeacms/volto-eea-website-theme/config';
import { runtimeConfig } from '@plone/volto/runtime_config';
import StagingBanner from './StagingBanner';
import {
  BodyClassEdit,
  BodyClassView,
} from '@eeacms/volto-circularity-policy/components/manage/Blocks/BodyClass';
import worldSVG from '@plone/volto/icons/world.svg';
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

  config.settings.showTags = false;

  // Enable Title block
  config.blocks.blocksConfig.title.restricted = false;

  // Enable description block (also for cypress)
  config.blocks.blocksConfig.description.restricted = false;

  //Make all blocks deleteable
  config.blocks.requiredBlocks = [];

  config.settings.isMultilingual = false;

  config.blocks.blocksConfig.body_classname = {
    id: 'body_classname',
    title: 'Body classname',
    icon: worldSVG,
    group: 'common',
    edit: BodyClassEdit,
    view: BodyClassView,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    blocks: {},
    security: {
      addPermission: [],
      view: [],
    },
    blockHasOwnFocusManagement: true,
  };

  return config;
};

export default applyConfig;

import { runtimeConfig } from '@plone/volto/runtime_config';
import StagingBanner from './StagingBanner';
import {
  BodyClassEdit,
  BodyClassView,
} from '@eeacms/volto-circularity-policy/components/manage/Blocks/BodyClass';
import worldSVG from '@plone/volto/icons/world.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
import { LINK } from '@plone/volto-slate/constants';
import { LinkElement } from '@plone/volto-slate/editor/plugins/AdvancedLink/render';
import { withLink } from '@plone/volto-slate/editor/plugins/AdvancedLink/extensions';
import { linkDeserializer } from '@plone/volto-slate/editor/plugins/AdvancedLink/deserialize';
import LinkEditSchema from '@plone/volto-slate/editor/plugins/AdvancedLink/schema';
import { defineMessages } from 'react-intl';

import './less/slate-metadata.less';
import './less/slate-styles.less';

const messages = defineMessages({
  edit: {
    id: 'Edit link',
    defaultMessage: 'Edit link',
  },
  delete: {
    id: 'Remove link',
    defaultMessage: 'Remove link',
  },
  document_view: {
    id: 'Document View',
    defaultMessage: 'Document View',
  },
  herosection_view: {
    id: 'Hero Section View',
    defaultMessage: 'Hero Section View',
  },
  fullwidth_view: {
    id: 'Full Width View',
    defaultMessage: 'Full Width View',
  },
  improving: {
    id: 'Improving',
    defaultMessage: 'Improving',
  },
  deteriotating: {
    id: 'Deteriotating',
    defaultMessage: 'Deteriotating',
  },
  stable: {
    id: 'Stable',
    defaultMessage: 'Stable',
  },
  no_trend: {
    id: 'No trend',
    defaultMessage: 'No trend',
  },
});

const applyConfig = (config) => {
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

  config.settings.eea = config.settings.eea || {};

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

  //remove data-blocks
  config.blocks.groupBlocksOrder = [
    ...(config.blocks.groupBlocksOrder || []).filter(
      (blocks_section) => blocks_section.id !== 'data_blocks',
    ),
  ];

  //remove treemap plotly block
  if (config.blocks.blocksConfig.treemapChart)
    config.blocks.blocksConfig.treemapChart.restricted = true;

  //remove plotly block
  if (config.blocks.blocksConfig.plotly_chart)
    config.blocks.blocksConfig.plotly_chart.restricted = true;

  if (config.blocks.blocksConfig.connected_plotly_chart)
    config.blocks.blocksConfig.connected_plotly_chart.restricted = true;

  config.settings.integratesBlockStyles = [
    ...(config.settings.integratesBlockStyles.filter(
      (blocks) => blocks !== 'slate',
    ) || []),
  ];

  config.settings.slate.styleMenu = config.settings.slate.styleMenu || {};
  config.settings.slate.styleMenu.blockStyles = [
    ...(config.settings.slate.styleMenu?.blockStyles || []),
    { cssClass: 'box-headings-type-1', label: 'Box headings type 1' },
    { cssClass: 'box-headings-type-2', label: 'Box headings type 2' },
  ];

  // Call to Action enhance schema
  if (config.blocks.blocksConfig.callToActionBlock) {
    const oldSchemaEnhancer =
      config.blocks.blocksConfig.callToActionBlock.schemaEnhancer;
    config.blocks.blocksConfig.callToActionBlock.schemaEnhancer = ({
      formData,
      schema,
      intl,
    }) => {
      const resSchema = oldSchemaEnhancer({ formData, schema, intl });
      resSchema.properties.styles.schema.properties.theme.choices.push(
        ['improving', intl.formatMessage(messages.improving)],
        ['deteriotating', intl.formatMessage(messages.deteriotating)],
        ['no-trend', intl.formatMessage(messages.no_trend)],
        ['stable', intl.formatMessage(messages.stable)],
      );
      return resSchema;
    };
  }

  //advancedlink is currently not working properly/not recognized in fise, so we add it to config manually
  const { slate } = config.settings;

  slate.toolbarButtons = [...(slate.toolbarButtons || []), LINK];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    LINK,
  ];

  slate.htmlTagsToSlate.A = linkDeserializer;

  const opts = {
    title: 'Link',
    pluginId: LINK,
    elementType: LINK,
    element: LinkElement,
    isInlineElement: true,
    editSchema: LinkEditSchema,
    extensions: [withLink],
    hasValue: (formData) => !!formData.link,
    toolbarButtonIcon: linkSVG,
    messages,
  };

  const [installLinkEditor] = makeInlineElementPlugin(opts);
  config = installLinkEditor(config);

  return config;
};

export default applyConfig;

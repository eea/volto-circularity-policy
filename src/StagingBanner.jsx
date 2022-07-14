import React from 'react';
import { connect } from 'react-redux';
import { Portal } from 'react-portal';
import cx from 'classnames';
import { Message, Container } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { Icon } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';

import './less/staging-banner.less';

const staticBanner = {
  type: 'warning',
  title: 'Under construction',
  message: 'Content is being added and is still in draft.',
};

const StagingBanner = ({ banner = {} }) => {
  const bannerConfig = {
    ...(config.settings.stagingBanner || {}),
    ...(banner.config || {}),
  };

  const [node, setNode] = React.useState('');
  const [staticBannerVisible, setStaticBannerVisible] = React.useState(true);

  const hideStaticBanner = React.useCallback(() => {
    setStaticBannerVisible(false);
  }, [setStaticBannerVisible]);

  React.useEffect(() => {
    setNode(document.querySelector(bannerConfig.parentNodeSelector));
  }, [bannerConfig.parentNodeSelector]);

  if (!node || bannerConfig.static_banner?.enabled) return '';

  return (
    <Portal node={node}>
      {staticBannerVisible && (
        <Message
          className={cx('stagingBanner static-banner', staticBanner.type)}
          icon
        >
          <BodyClass className="has-banner" />
          <Container>
            <Message.Content>
              <Message.Header>{staticBanner.title}</Message.Header>
              <p
                dangerouslySetInnerHTML={{
                  __html: staticBanner.message,
                }}
              />
            </Message.Content>
            <div>
              {bannerConfig.bannerIcon && (
                <Icon
                  name={bannerConfig.bannerIcon}
                  color={bannerConfig.bannerIconColor || 'black'}
                  size="32px"
                />
              )}
              {bannerConfig.bannerCloseIcon && (
                <Icon
                  name={bannerConfig.bannerCloseIcon}
                  color={bannerConfig.bannerCloseIconColor || 'black'}
                  className="close-button"
                  size="32px"
                  onClick={hideStaticBanner}
                />
              )}
            </div>
          </Container>
        </Message>
      )}
    </Portal>
  );
};

export default connect((state) => ({
  banner: state.banner,
}))(StagingBanner);

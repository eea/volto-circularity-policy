/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React from 'react';
import { Dropdown, Image, Segment, Container } from 'semantic-ui-react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { UniversalLink, Navigation } from '@plone/volto/components';
import {
  getBaseUrl,
  hasApiExpander,
  flattenToAppURL,
} from '@plone/volto/helpers';
import { getNavigation } from '@plone/volto/actions';
import { Header, Logo } from '@eeacms/volto-eea-design-system/ui';
import { usePrevious } from '@eeacms/volto-eea-design-system/helpers';
import { find } from 'lodash';
import WhiteLogoImage from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/logo/eea-white.svg';
import LogoImage from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/eea-logo.svg';
import globeIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/global-line.svg';
import eeaFlag from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/eea.png';

import config from '@plone/volto/registry';
import { compose } from 'recompose';
import { BodyClass } from '@plone/volto/helpers';

import cx from 'classnames';

/**
 * EEA Specific Header component.
 */
const EEAHeader = ({ pathname, token, items, history }) => {
  const currentLang = useSelector((state) => state.intl.locale);

  const router_pathname = useSelector((state) => {
    return state.router?.location?.pathname || '';
  });

  const isHomePageInverse = useSelector((state) => {
    const layout = state.content?.data?.layout;
    const has_home_layout = layout === 'homepage_inverse_view';
    return (
      has_home_layout &&
      (pathname === router_pathname || router_pathname.endsWith('/edit'))
    );
  });

  const { eea } = config.settings;
  const width = useSelector((state) => state.screen?.width);
  const dispatch = useDispatch();
  const previousToken = usePrevious(token);

  React.useEffect(() => {
    const { settings } = config;
    const base_url = getBaseUrl(pathname);
    if (!hasApiExpander('navigation', base_url)) {
      dispatch(getNavigation(base_url, settings.navDepth));
    }
  }, [pathname, dispatch]);

  React.useEffect(() => {
    if (token !== previousToken) {
      const { settings } = config;
      const base = getBaseUrl(pathname);
      if (!hasApiExpander('navigation', base)) {
        dispatch(getNavigation(base, settings.navDepth));
      }
    }
  }, [token, dispatch, pathname, previousToken]);

  return (
    <Header menuItems={items}>
      {isHomePageInverse && <BodyClass className="homepage" />}
      <Header.TopHeader>
        <Header.TopItem className="official-union">
          <Image src={eeaFlag} alt="eea flag"></Image>
          <Header.TopDropdownMenu
            text="An official website of the European Union | How do you Know?"
            tabletText="EEA information systems"
            mobileText=" "
            icon="chevron down"
            aria-label="dropdown"
            className=""
            viewportWidth={width}
          >
            <div
              className="content"
              role="menu"
              tabIndex="0"
              onClick={(evt) => evt.stopPropagation()}
              onKeyDown={(evt) => evt.stopPropagation()}
            >
              <p>
                All official European Union website addresses are in the{' '}
                <b>europa.eu</b> domain.
              </p>
              <a
                href="https://europa.eu/european-union/contact/institutions-bodies_en"
                target="_blank"
                rel="noreferrer"
                role="option"
                aria-selected="false"
              >
                See all EU institutions and bodies
              </a>
            </div>
          </Header.TopDropdownMenu>
        </Header.TopItem>

        <Header.TopItem>
          <Header.TopDropdownMenu
            id="theme-sites"
            text={eea.globalHeaderPartnerLinks.title}
            viewportWidth={width}
          >
            <div className="wrapper">
              {eea.globalHeaderPartnerLinks.links.map((item, index) => (
                <Dropdown.Item key={index}>
                  <a
                    href={item.href}
                    className="site"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.title}
                  </a>
                </Dropdown.Item>
              ))}
            </div>
          </Header.TopDropdownMenu>
        </Header.TopItem>
      </Header.TopHeader>
      <Header.Main
        pathname={pathname}
        inverted={isHomePageInverse ? true : false}
        transparency={isHomePageInverse ? true : false}
        logo={
          <Logo
            src={isHomePageInverse ? WhiteLogoImage : LogoImage}
            title={eea.websiteTitle}
            alt={eea.organisationName}
            url={eea.logoTargetUrl}
          />
        }
        menuItems={items}
        renderGlobalMenuItem={(item, { onClick }) => (
          <UniversalLink
            href={item['@id'] || item.url}
            title={item.title}
            onClick={(e) => {
              onClick(e, item);
            }}
            className={cx({
              active: item.url === router_pathname,
            })}
          >
            {item.title}
          </UniversalLink>
        )}
      ></Header.Main>
    </Header>
  );
};

export default compose(
  withRouter,
  connect(
    (state) => ({
      token: state.userSession.token,
      items: state.navigation.items,
    }),
    { getNavigation },
  ),
)(EEAHeader);

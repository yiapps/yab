import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import SidebarSectionTitle from './sidebar_section_title'
import SidebarSectionItem from './sidebar_section_item'
import Heading from './heading'
import BackButton from './back_button'

class Sidebar extends ImmutablePureComponent {

  render() {
    const {
      intl,
      account,
      title,
    } = this.props

    if (!me || !account) return null

    const menuItems = [
      {
        title: intl.formatMessage(messages.blocks),
        to: '/settings/blocks',
      },
      {
        title: intl.formatMessage(messages.mutes),
        to: '/settings/mutes',
      },
      {
        title: intl.formatMessage(messages.preferences),
        href: '/settings/preferences',
      },
    ]

    return (
      <header role='banner' className={[_s.d, _s.flexGrow1, _s.z3, _s.aiEnd].join(' ')}>
        <div className={[_s.d, _s.w240PX].join(' ')}>
          <div className={[_s.d, _s.posFixed, _s.calcH53PX, _s.bottom0].join(' ')}>
            <div className={[_s.d, _s.h100PC, _s.aiStart, _s.w240PX, _s.pr15, _s.py10, _s.noScrollbar, _s.overflowYScroll].join(' ')}>
              <div className={[_s.d, _s.w100PC].join(' ')}>
                <div className={[_s.d, _s.flexRow, _s.px5, _s.pt10].join(' ')}>
                  <BackButton
                    icon='arrow-left'
                    toHome
                  />
                  <Heading size='h1'>
                    {title}
                  </Heading>
                </div>

              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.d, _s.w100PC, _s.mb15].join(' ')}>
                <SidebarSectionTitle>{intl.formatMessage(messages.menu)}</SidebarSectionTitle>
                {
                  menuItems.map((menuItem, i) => {
                    if (menuItem.hidden) return null

                    return (
                      <SidebarSectionItem {...menuItem} key={`sidebar-item-menu-${i}`} />
                    )
                  })
                }
              </nav>

            </div>
          </div>
        </div>
      </header>
    )
  }

}

const messages = defineMessages({
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
})

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

Sidebar.propTypes = {
  intl: PropTypes.object.isRequired,
  account: ImmutablePropTypes.map,
  title: PropTypes.string,
}

export default injectIntl(connect(mapStateToProps)(Sidebar))
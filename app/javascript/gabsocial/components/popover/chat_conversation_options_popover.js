import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import { openModal } from '../../actions/modal'
import {
  isChatMessengerBlocked,
  isChatMessengerMuted,
  blockChatMessenger,
  unblockChatMessenger,
  muteChatMessenger,
  unmuteChatMessenger,
} from '../../actions/chat_conversation_accounts'
import { MODAL_PRO_UPGRADE } from '../../constants'
import { me } from '../../initial_state'
import { makeGetChatConversation } from '../../selectors'
import { changeSetting, saveSettings } from '../../actions/settings'
import PopoverLayout from './popover_layout'
import List from '../list'

class ChatConversationOptionsPopover extends ImmutablePureComponent {

  handleOnHide = () => {
    this.props.onHide()
    this.handleOnClosePopover()
  }

  handleOnBlock = () => {
    this.props.onBlock()
    this.handleOnClosePopover()
  }

  handleOnUnblock = () => {
    this.props.onUnblock()
    this.handleOnClosePopover()
  }

  handleOnMute = () => {
    this.props.onMute()
    this.handleOnClosePopover()
  }

  handleOnUnmute = () => {
    this.props.onUnute()
    this.handleOnClosePopover()
  }

  handleOnPurge = () => {
    if (!this.props.isPro) {
      this.props.openProUpgradeModal()
    } else {
      this.props.onPurge()
    }

    this.handleOnClosePopover()
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      intl,
      isXS,
    } = this.props

    const items = [
      {
        hideArrow: true,
        title: 'Block Messenger',
        subtitle: 'The messenger will not be able to message you.',
        onClick: () => this.handleOnBlock(),
      },
      {
        hideArrow: true,
        title: 'Mute Messenger',
        subtitle: 'You will not be notified of new messsages',
        onClick: () => this.handleOnMute(),
      },
      {
        hideArrow: true,
        title: 'Hide Conversation',
        subtitle: 'Hide until next message',
        onClick: () => this.handleOnHide(),
      },
      {},
      {
        hideArrow: true,
        title: 'Purge messages',
        subtitle: 'Remove all of your messages in this conversation',
        onClick: () => this.handleOnPurge(),
      },
    ]

    return (
      <PopoverLayout
        width={220}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          size={isXS ? 'large' : 'small'}
          scrollKey='chat_conversation_options'
          items={items}
        />
      </PopoverLayout>
    )
  }
}

const mapStateToProps = (state, { chatConversationId }) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
  chatConversation: makeGetChatConversation()(state, { id: chatConversationId }),
})

const mapDispatchToProps = (dispatch) => ({
  openProUpgradeModal() {
    dispatch(openModal(MODAL_PRO_UPGRADE))
  },
  onSetCommentSortingSetting(type) {
    dispatch(closePopover())
  },
  onClosePopover: () => dispatch(closePopover()),
})

ChatConversationOptionsPopover.propTypes = {
  isXS: PropTypes.bool,
  isPro: PropTypes.bool.isRequired,
  chatConversation: ImmutablePropTypes.map,
  onClosePopover: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversationOptionsPopover)
import { FormattedMessage } from 'react-intl'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable';
import {
  replyCompose,
  mentionCompose,
  quoteCompose,
} from '../actions/compose';
import {
  repost,
  favorite,
  unrepost,
  unfavorite,
} from '../actions/interactions';
import {
  hideStatus,
  revealStatus,
  fetchComments,
  fetchContext,
} from '../actions/statuses';
import { openModal } from '../actions/modal';
import { openPopover } from '../actions/popover';
import {
  me,
  boostModal,
} from '../initial_state'
import {
  MODAL_BOOST,
  MODAL_CONFIRM,
} from '../constants'
import { makeGetStatus } from '../selectors'
import Status from '../components/status';

const getDescendants = (state, status, highlightStatusId) => {
  let descendantsIds = ImmutableList()
  let indent = -1

  descendantsIds = descendantsIds.withMutations(mutable => {
    const ids = [status.get('id')]

    while (ids.length > 0) {
      let id = ids.shift()
      const replies = state.getIn(['contexts', 'replies', id])

      if (status.get('id') !== id) {
        mutable.push(ImmutableMap({
          statusId: id,
          indent: indent,
          isHighlighted: highlightStatusId === id,
        }))
      }

      if (replies) {
        replies.reverse().forEach(reply => {
          ids.unshift(reply)
        });
        indent++
        indent = Math.min(2, indent)
      } else {
        indent = 0 // reset
      }
    }
  })

  return descendantsIds
}

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus()

  const mapStateToProps = (state, props) => {
    const statusId = props.id || props.params.statusId
    const username = props.params ? props.params.username : undefined

    const status = getStatus(state, {
      id: statusId,
      username: username,
    })

    let fetchedContext = false
    let descendantsIds = ImmutableList()
    let ancestorStatus
    
    //

    if (status && status.get('in_reply_to_account_id') && !props.isChild) {
      fetchedContext = true

      let inReplyTos = state.getIn(['contexts', 'inReplyTos'])
      
      let ancestorsIds = ImmutableList()
      ancestorsIds = ancestorsIds.withMutations(mutable => {
        let id = statusId;
  
        while (id) {
          mutable.unshift(id)
          id = inReplyTos.get(id)
        }
      })
  
      const ancestorStatusId = ancestorsIds.get(0)
      if (ancestorStatusId !== statusId) {
        ancestorStatus = getStatus(state, {
          id: ancestorStatusId,
        })
        descendantsIds = getDescendants(state, ancestorStatus, statusId)
      }
    }

    //

    if (status && status.get('replies_count') > 0 && !fetchedContext) {
      descendantsIds = getDescendants(state, status)
    }

    const isComment = !!status ? !!status.get('in_reply_to_id') : false

    return {
      status,
      ancestorStatus,
      descendantsIds,
      isComment,
      isComposeModalOpen: state.getIn(['modal', 'modalType']) === 'COMPOSE',
    }
  }

  return mapStateToProps
};

const mapDispatchToProps = (dispatch) => ({
  onReply (status, router, showModal) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch((_, getState) => {
      const state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.reply.message' defaultMessage='Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.reply.confirm' defaultMessage='Reply' />,
          onConfirm: () => dispatch(replyCompose(status, router)),
        }))
      } else {
        dispatch(replyCompose(status, router, showModal));
      }
    })
  },

  onShowRevisions (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(openModal('STATUS_REVISION', { status }));
  },

  onFavorite (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('favourited')) {
      dispatch(unfavorite(status));
    } else {
      dispatch(favorite(status));
    }
  },

  onMention (account, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(mentionCompose(account, router));
  },

  onOpenMedia (media, index) {
    dispatch(openModal('MEDIA', { media, index }));
  },

  onOpenVideo (media, time) {
    dispatch(openModal('VIDEO', { media, time }));
  },

  onToggleHidden (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('hidden')) {
      dispatch(revealStatus(status.get('id')));
    } else {
      dispatch(hideStatus(status.get('id')));
    }
  },

  onOpenLikes(status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(openModal('STATUS_LIKES', { status }))
  },
    
  onOpenReposts(status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(openModal('STATUS_REPOSTS', { status }))
  },
  
  onFetchComments(statusId) {
    dispatch(fetchComments(statusId))
  },

  onFetchContext(statusId) {
    dispatch(fetchContext(statusId))
  },

  onQuote (status, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))
    
    dispatch((_, getState) => {
      const state = getState()
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal(MODAL_CONFIRM, {
          message: <FormattedMessage id='confirmations.quote.message' defaultMessage='Quoting now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.quote.confirm' defaultMessage='Quote' />,
          onConfirm: () => dispatch(quoteCompose(status, router)),
        }))
      } else {
        dispatch(quoteCompose(status, router))
      }
    })
  },

  onRepost (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))
    
    const alreadyReposted = status.get('reblogged')

    if (boostModal && !alreadyReposted) {
      dispatch(openModal(MODAL_BOOST, {
        status,
        onRepost: () => dispatch(repost(status)),
      }))
    } else {
      if (alreadyReposted) {
        dispatch(unrepost(status))
      } else {
        dispatch(repost(status))
      }
    }
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(Status);

import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import api from '../../api'
import ModalLayout from './modal_layout'
import Divider from '../divider'
import Icon from '../icon'
import Input from '../input'
import Text from '../text'

class EmbedModal extends ImmutablePureComponent {

  state = {
    loading: false,
    oembed: null,
  }

  componentDidMount() {
    const { url } = this.props

    this.setState({ loading: true })

    api().post('/api/web/embed', { url }).then(res => {
      this.setState({ loading: false, oembed: res.data })

      const iframeDocument = this.iframe.contentWindow.document

      iframeDocument.open()
      iframeDocument.write(res.data.html)
      iframeDocument.close()

      iframeDocument.body.style.margin = 0
      this.iframe.width = iframeDocument.body.scrollWidth
      this.iframe.height = iframeDocument.body.scrollHeight
    }).catch(error => {
      this.props.onError(error)
    })
  }

  setIframeRef = c => {
    this.iframe = c
  }

  handleTextareaClick = (e) => {
    e.target.select()
  }

  render() {
    const { intl, onClose } = this.props
    const { oembed } = this.state

    return (
      <ModalLayout
        title={intl.formatMessage(messages.embed)}
        onClose={onClose}
      >
        <div className={_s.d}>
          <Text className={_s.my10}>
            {intl.formatMessage(messages.instructions)}
          </Text>

          <div className={[_s.d, _s.mb10].join(' ')}>
            <Input
              readOnly
              type='text'
              className='embed-modal__html'
              value={oembed && oembed.html || ''}
              onClick={this.handleTextareaClick}
            />
          </div>

          <Divider />

          <Text className={_s.mb10}>
            {intl.formatMessage(messages.preview)}
          </Text>

          <div className={[_s.d, _s.w100PC, _s.bgSubtle, _s.h220PX, _s.aiCenter, _s.jcCenter].join(' ')}>
            <iframe
              className={[_s.d, _s.w100PC, _s.h100PC, _s.z2].join(' ')}
              frameBorder='0'
              ref={this.setIframeRef}
              sandbox='allow-same-origin'
              title='preview'
            />
            {
              !oembed && 
              <Icon id='loading' size='34px' className={[_s.posAbs, _s.z3].join(' ')} />
            }
          </div>

        </div>
      </ModalLayout>
    )
  }

}

const messages = defineMessages({
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  instructions: { id: 'embed.instructions', defaultMessage: 'Embed this status on your website by copying the code below.' },
  preview: { id: 'embed.preview', defaultMessage: 'Here is what it will look like:' },
})

EmbedModal.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(EmbedModal)
import { defineMessages, injectIntl } from 'react-intl'
import Button from '../button'
import Block from '../block'
import Heading from '../heading'

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
})

export default
@injectIntl
class ModalLayout extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { title, children, intl, onClose } = this.props

    return (
      <div className={[_s.width645PX].join(' ')}>
        <Block>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.paddingHorizontal15PX].join(' ')}>
            <Heading size='h3'>
              {title}
            </Heading>
            <Button
              className=''
              title={intl.formatMessage(messages.close)}
              onClick={onClose}
              icon='times'
              iconWidth='20px'
              iconWidth='20px'
            />
          </div>
          <div className={[_s.default, _s.paddingHorizontal15PX, _s.paddingVertical10PX].join(' ')}>
            {children}
          </div>
        </Block>
      </div>
    )
  }

}
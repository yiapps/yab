import { injectIntl, defineMessages } from 'react-intl'
import { URL_GAB_PRO } from '../../constants'
import PanelLayout from './panel_layout';
import Button from '../button'
import Icon from '../icon'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  text: { id: 'pro_upgrade_modal.text_sm', defaultMessage: 'Please consider supporting us on our mission to defend free expression online for all people.' },
})

export default
@injectIntl
class ProPanel extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool.isRequired,
  }

  render() {
    const { intl, isPro } = this.props

    if (isPro) return null

    const title = (
      <span className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
        <span className={[_s.default, _s.mr2].join(' ')}>
          Upgrade to Gab
        </span>
        <span className={[_s.bgPro, _s.colorBlack, _s.radiusSmall, _s.px5, _s.py5].join(' ')}>PRO</span>
      </span>
    )

    return (
      <PanelLayout
        title={title}
        subtitle={intl.formatMessage(messages.text)}
      >

        <div className={[_s.default, _s.flexRow, _s.pb5].join(' ')}>
          <Button
            isOutline
            color='brand'
            backgroundColor='none'
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mr10].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center'>
              Learn more
            </Text>
          </Button>
          <Button
            href={URL_GAB_PRO}
            className={[_s.flexRow, _s.flexGrow1, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}
          >
            <Text color='inherit' size='large' weight='bold' align='center'>
              Upgrade
            </Text>
            <Icon id='arrow-right' size='20px' className={[_s.fillWhite, _s.ml5].join(' ')} />
          </Button>
        </div>

      </PanelLayout>
    )
  }

}
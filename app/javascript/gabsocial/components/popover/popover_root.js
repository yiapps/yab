import {
  BREAKPOINT_EXTRA_SMALL,
  POPOVER_DATE_PICKER,
  POPOVER_EMOJI_PICKER,
  POPOVER_GROUP_OPTIONS,
  POPOVER_NAV_SETTINGS,
  POPOVER_PROFILE_OPTIONS,
  POPOVER_REPOST_OPTIONS,
  POPOVER_SEARCH,
  POPOVER_SIDEBAR_MORE,
  POPOVER_STATUS_OPTIONS,
  POPOVER_STATUS_SHARE,
  POPOVER_STATUS_VISIBILITY,
  POPOVER_USER_INFO,
} from '../../constants'
import {
  DatePickerPopover,
  EmojiPickerPopover,
  GroupOptionsPopover,
  NavSettingsPopover,
  ProfileOptionsPopover,
  RepostOptionsPopover,
  SearchPopover,
  SidebarMorePopover,
  StatusOptionsPopover,
  StatusSharePopover,
  StatusVisibilityPopover,
  UserInfoPopover,
} from '../../features/ui/util/async_components'

import { closePopover } from '../../actions/popover'
import { getWindowDimension } from '../../utils/is_mobile'
import Bundle from '../../features/ui/util/bundle'
import ModalBase from '../modal/modal_base'
import PopoverBase from './popover_base'

const initialState = getWindowDimension()

const POPOVER_COMPONENTS = {}
POPOVER_COMPONENTS[POPOVER_DATE_PICKER] = DatePickerPopover
POPOVER_COMPONENTS[POPOVER_EMOJI_PICKER] = EmojiPickerPopover
POPOVER_COMPONENTS[POPOVER_GROUP_OPTIONS] = GroupOptionsPopover
POPOVER_COMPONENTS[POPOVER_NAV_SETTINGS] = NavSettingsPopover
POPOVER_COMPONENTS[POPOVER_PROFILE_OPTIONS] = ProfileOptionsPopover
POPOVER_COMPONENTS[POPOVER_REPOST_OPTIONS] = RepostOptionsPopover
POPOVER_COMPONENTS[POPOVER_SEARCH] = SearchPopover
POPOVER_COMPONENTS[POPOVER_SIDEBAR_MORE] = SidebarMorePopover
POPOVER_COMPONENTS[POPOVER_STATUS_OPTIONS] = StatusOptionsPopover
POPOVER_COMPONENTS[POPOVER_STATUS_SHARE] = StatusSharePopover
POPOVER_COMPONENTS[POPOVER_STATUS_VISIBILITY] = StatusVisibilityPopover
POPOVER_COMPONENTS[POPOVER_USER_INFO] = UserInfoPopover

const mapStateToProps = (state) => ({
  type: state.getIn(['popover', 'popoverType']),
  props: state.getIn(['popover', 'popoverProps'], {}),
})

const mapDispatchToProps = (dispatch) => ({
  onClose: (type) => dispatch(closePopover(type)),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class PopoverRoot extends PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    width: initialState.width,
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false)
  }

  componentDidUpdate() {
    const { type } = this.props
    const { width } = this.state

    if (width <= BREAKPOINT_EXTRA_SMALL && !!type) {
      document.body.classList.add(_s.overflowYHidden)
    } else {
      document.body.classList.remove(_s.overflowYHidden)
    }
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
  }

  renderEmpty = () => {
    return <div />
  }

  render() {
    const { type, props, onClose } = this.props
    const { width } = this.state

    const visible = !!type

    const isXS = width <= BREAKPOINT_EXTRA_SMALL
    const Wrapper = isXS ? ModalBase : PopoverBase

    return (
      <Wrapper
        onClose={onClose}
        visible={visible}
        innerRef={this.setRef}
        {...props}
      >
        {
          visible &&
          <Bundle
            fetchComponent={POPOVER_COMPONENTS[type]}
            loading={this.renderEmpty}
            error={this.renderEmpty}
            renderDelay={200}
          >
            {
              (Component) => <Component isXS={isXS} {...props} />
            }
          </Bundle>
        }
      </Wrapper>
    )
  }

}
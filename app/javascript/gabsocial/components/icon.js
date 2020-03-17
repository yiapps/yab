import * as I from '../assets'

const ICON_MAP = {
  '': I.CircleIcon,
  'add': I.AddIcon,
  'angle-right': I.AngleRightIcon,
  'apps': I.AppsIcon,
  'audio': I.AudioIcon,
  'audio-mute': I.AudioMuteIcon,
  'back': I.BackIcon,
  'calendar': I.CalendarIcon,
  'chat': I.ChatIcon,
  'close': I.CloseIcon,
  'comment': I.CommentIcon,
  'dissenter': I.DissenterIcon,
  'ellipsis': I.EllipsisIcon,
  'error': I.ErrorIcon,
  'fullscreen': I.FullscreenIcon,
  'globe': I.GlobeIcon,
  'group': I.GroupIcon,
  'happy': I.HappyIcon,
  'home': I.HomeIcon,
  'like': I.LikeIcon,
  'link': I.LinkIcon,
  'list': I.ListIcon,
  'loading': I.LoadingIcon,
  'media': I.MediaIcon,
  'minimize-fullscreen': I.MinimizeFullscreenIcon,
  'missing': I.MissingIcon,
  'more': I.MoreIcon,
  'notifications': I.NotificationsIcon,
  'pause': I.PauseIcon,
  'pin': I.PinIcon,
  'play': I.PlayIcon,
  'poll': I.PollIcon,
  'repost': I.RepostIcon,
  'search': I.SearchIcon,
  'search-alt': I.SearchAltIcon,
  'share': I.ShareIcon,
  'shop': I.ShopIcon,
  'subtract': I.SubtractIcon,
  'trends': I.TrendsIcon,
  'verified': I.VerifiedIcon,
  'warning': I.WarningIcon,
}

export default class Icon extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
  }

  render() {
    const { id, ...options } = this.props;
    const IconAsset = ICON_MAP[id];
    return <IconAsset {...options} />
  }
}

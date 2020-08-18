import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { saveUserProfileInformation } from '../../actions/user'
import { me } from '../../initial_state'
import Button from '../button'
import Block from '../block'
import Divider from '../divider'
import FileInput from '../file_input'
import Input from '../input'
import Switch from '../switch'
import Heading from '../heading'
import Textarea from '../textarea'

class EditProfileModal extends ImmutablePureComponent {

  state = {
    avatarSrc: this.props.account ? this.props.account.get('avatar_static') : undefined,
    bioValue: this.props.account ? this.props.account.get('note_plain') : '',
    displayNameValue: this.props.account ? this.props.account.get('display_name_plain') : '',
    headerSrc: this.props.account ? this.props.account.get('header_static') : undefined,
    locked: this.props.account ? this.props.account.get('locked') : false,
  }

  componentDidUpdate (prevProps) {
    if (prevProps.account !== this.props.account) {
      if (this.props.account) {
        this.setState({
          avatarSrc: this.props.account.get('avatar_static'),
          bioValue: this.props.account.get('note_plain'),
          displayNameValue: this.props.account.get('display_name_plain'),
          headerSrc: this.props.account.get('header_static'),
          locked: this.props.account.get('locked'),
        })
      } else {
        this.setState({
          avatarSrc: undefined,
          bioValue: '',
          displayNameValue: '',
          headerSrc: undefined,
          locked: false,
        })
      }
    }
  }

  handleCoverPhotoChange = (e) => {
    try {
      this.setState({ headerSrc: e.target.files[0] })
    } catch (error) {
      // 
    }
  }

  handleProfilePhotoChange = (e) => {
    try {
      this.setState({ avatarSrc: e.target.files[0] })
    } catch (error) {
      // 
    }
  }

  handleDisplayNameChange = (value) => {
    this.setState({ displayNameValue: value })
  }

  handleBioChange = (value) => {
    this.setState({ bioValue: value })
  }

  handleLockedChange = ({ target }) => {
    this.setState({ locked: target.checked })
  }

  handleOnClose = () => {
    this.props.onClose()
  }

  handleOnSave = () => {
    const { account } = this.props
    const {
      avatarSrc,
      bioValue,
      displayNameValue,
      headerSrc,
      locked,
    } = this.state

    const isVerified = account.get('is_verified')

    const obj = {}
    obj.locked = locked
    if (!isVerified && account.get('display_name_plain') !== displayNameValue) obj.displayName = displayNameValue
    if (account.get('note_plain') !== bioValue) obj.note = bioValue
    if (account.get('avatar_static') !== avatarSrc) obj.avatar = avatarSrc
    if (account.get('header_static') !== headerSrc) obj.header = headerSrc

    this.props.onSave(obj)
    this.handleOnClose()
  }

  render() {
    const { intl, account } = this.props
    const {
      avatarSrc,
      bioValue,
      displayNameValue,
      headerSrc,
      locked,
    } = this.state

    const isVerified = account.get('is_verified')

    return (
      <div style={{ width: '440px' }} className={[_s.d, _s.modal].join(' ')}>
        <Block>
          <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.h53PX, _s.px15].join(' ')}>
            <Button
              backgroundColor='none'
              title={intl.formatMessage(messages.close)}
              className={[_s.mrAuto, _s.w60PX, _s.pl0].join(' ')}
              onClick={this.handleOnClose}
              color='secondary'
              icon='close'
              iconSize='10px'
            />
            <Heading size='h2'>
              {intl.formatMessage(messages.edit_profile)}
            </Heading>
            <Button
              title={intl.formatMessage(messages.save)}
              className={[_s.mlAuto, _s.w60PX].join(' ')}
              onClick={this.handleOnSave}
            >
              {intl.formatMessage(messages.save)}
            </Button>
          </div>
          <div className={[_s.d, _s.maxH80VH, _s.overflowYScroll].join(' ')}>
            <div className={[_s.d, _s.w100PC, _s.aiCenter].join(' ')}>
              <FileInput
                width='440px'
                height='180px'
                id='cover-photo'
                onChange={this.handleCoverPhotoChange}
                file={headerSrc}
              />
              <div className={[_s.d, _s.mtNeg50PX, _s.aiCenter, _s.jcCenter].join(' ')}>
                <FileInput
                  width='132px'
                  height='132px'
                  id='profile-photo'
                  file={avatarSrc}
                  className={[_s.circle, _s.border6PX, _s.borderColorWhite, _s.bgPrimary].join(' ')}
                  onChange={this.handleProfilePhotoChange}
                />
              </div>
              <div className={[_s.d, _s.py5, _s.px15, _s.mt5, _s.mb15, _s.w100PC].join(' ')}>
                {
                  !isVerified &&
                  <React.Fragment>
                    <Input
                      id='display-name'
                      title='Display name'
                      value={displayNameValue}
                      onChange={this.handleDisplayNameChange}
                      onBlur={this.handleDisplayNameBlur}
                    />
                    <Divider isInvisible />
                  </React.Fragment>
                }

                <Textarea
                  title='Bio'
                  value={bioValue}
                  disabled={false}
                  onChange={this.handleBioChange}
                  placeholder='Add your bio...'
                />

                <Divider isInvisible />

                <div className={[_s.d, _s.px10].join(' ')}>
                  <Switch
                    label='Private account'
                    checked={locked}
                    onChange={this.handleLockedChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </Block>
      </div>
    )
  }
}

const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  save: { id: 'lightbox.save', defaultMessage: 'Save' },
})

const mapStateToProps = (state) => ({
  account: state.getIn(['accounts', me]),
})

const mapDispatchToProps = (dispatch) => ({
  onSave: (data) => dispatch(saveUserProfileInformation(data)),
})

EditProfileModal.propTypes = {
  account: ImmutablePropTypes.map,
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(EditProfileModal))
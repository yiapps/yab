import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import ColumnHeaderSettingButton from '../../../../components/column_header_setting_button';
import SettingToggle from '../../../../components/setting_toggle';
import ColumnSettingsHeading from '../../../../components/column_settings_heading';

export default class ColumnSettings extends ImmutablePureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    pushSettings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  onPushChange = (path, checked) => {
    this.props.onChange(['push', ...path], checked);
  }

  render () {
    const { settings, pushSettings, onChange, onClear } = this.props;

    const filterShowStr = <FormattedMessage id='notifications.column_settings.filter_bar.show' defaultMessage='Show' />;
    const filterAdvancedStr = <FormattedMessage id='notifications.column_settings.filter_bar.advanced' defaultMessage='Display all categories' />;
    const alertStr  = <FormattedMessage id='notifications.column_settings.alert' defaultMessage='Desktop notifications' />;
    const showStr   = <FormattedMessage id='notifications.column_settings.show' defaultMessage='Show in column' />;
    const soundStr  = <FormattedMessage id='notifications.column_settings.sound' defaultMessage='Play sound' />;

    const showPushSettings = pushSettings.get('browserSupport') && pushSettings.get('isSubscribed');
    const pushStr = showPushSettings && <FormattedMessage id='notifications.column_settings.push' defaultMessage='Push notifications' />;

    return (
      <div>
        <ColumnHeaderSettingButton
          onClick={onClear}
          title={<FormattedMessage id='notifications.clear' defaultMessage='Clear notifications' />}
          icon='eraser'
        />

        <div role='group' aria-labelledby='notifications-filter-bar'>
          <ColumnSettingsHeading
            id='notifications-filter-bar'
            heading={<FormattedMessage id='notifications.column_settings.filter_bar.category' defaultMessage='Quick filter bar' />}
          />
          <SettingToggle id='show-filter-bar' prefix='notifications' settings={settings} settingPath={['quickFilter', 'show']} onChange={onChange} label={filterShowStr} />
          <SettingToggle id='show-filter-bar' prefix='notifications' settings={settings} settingPath={['quickFilter', 'advanced']} onChange={onChange} label={filterAdvancedStr} />
        </div>

        <div role='group' aria-labelledby='notifications-follow'>
          <ColumnSettingsHeading
            id='notifications-follow'
            heading={<FormattedMessage id='notifications.column_settings.follow' defaultMessage='New followers:' />}
          />

          <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'follow']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'follow']} onChange={this.onPushChange} label={pushStr} />}
          <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'follow']} onChange={onChange} label={showStr} />
          <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'follow']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-favourite'>
          <ColumnSettingsHeading
            id='notifications-favourite'
            heading={<FormattedMessage id='notifications.column_settings.favourite' defaultMessage='Favorites:' />}
          />

          <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'favourite']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'favourite']} onChange={this.onPushChange} label={pushStr} />}
          <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'favourite']} onChange={onChange} label={showStr} />
          <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'favourite']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-mention'>
          <ColumnSettingsHeading
            id='notifications-mention'
            heading={<FormattedMessage id='notifications.column_settings.mention' defaultMessage='Mentions:' />}
          />

          <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'mention']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'mention']} onChange={this.onPushChange} label={pushStr} />}
          <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'mention']} onChange={onChange} label={showStr} />
          <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'mention']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-reblog'>
          <ColumnSettingsHeading
            id='notifications-reblog'
            heading={<FormattedMessage id='notifications.column_settings.reblog' defaultMessage='Reposts:' />}
          />

          <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'reblog']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'reblog']} onChange={this.onPushChange} label={pushStr} />}
          <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'reblog']} onChange={onChange} label={showStr} />
          <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'reblog']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-poll'>
          <ColumnSettingsHeading
            id='notifications-poll'
            heading={<FormattedMessage id='notifications.column_settings.poll' defaultMessage='Poll results:' />}
          />

          <SettingToggle prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'poll']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingToggle prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'poll']} onChange={this.onPushChange} label={pushStr} />}
          <SettingToggle prefix='notifications' settings={settings} settingPath={['shows', 'poll']} onChange={onChange} label={showStr} />
          <SettingToggle prefix='notifications' settings={settings} settingPath={['sounds', 'poll']} onChange={onChange} label={soundStr} />
        </div>
      </div>
    );
  }

}

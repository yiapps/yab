import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import ColumnSettingsContainer from './containers/column_settings_container';
import { expandHashtagTimeline, clearTimeline } from '../../actions/timelines';
import { FormattedMessage } from 'react-intl';
import { connectHashtagStream } from '../../actions/streaming';
import { isEqual } from 'lodash';

const mapStateToProps = (state, props) => ({
  hasUnread: state.getIn(['timelines', `hashtag:${props.params.id}`, 'unread']) > 0,
});

export default @connect(mapStateToProps)
class HashtagTimeline extends React.PureComponent {

  disconnects = [];

  static propTypes = {
    params: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    hasUnread: PropTypes.bool,
  };

  title = () => {
    let title = [this.props.params.id];

    if (this.additionalFor('any')) {
      title.push(' ', <FormattedMessage key='any' id='hashtag.column_header.tag_mode.any'  values={{ additional: this.additionalFor('any') }} defaultMessage='or {additional}' />);
    }

    if (this.additionalFor('all')) {
      title.push(' ', <FormattedMessage key='all' id='hashtag.column_header.tag_mode.all'  values={{ additional: this.additionalFor('all') }} defaultMessage='and {additional}' />);
    }

    if (this.additionalFor('none')) {
      title.push(' ', <FormattedMessage key='none' id='hashtag.column_header.tag_mode.none' values={{ additional: this.additionalFor('none') }} defaultMessage='without {additional}' />);
    }

    return title;
  }

  additionalFor = (mode) => {
    const { tags } = this.props.params;

    if (tags && (tags[mode] || []).length > 0) {
      return tags[mode].map(tag => tag.value).join('/');
    } else {
      return '';
    }
  }

  _subscribe (dispatch, id, tags = {}) {
    let any  = (tags.any || []).map(tag => tag.value);
    let all  = (tags.all || []).map(tag => tag.value);
    let none = (tags.none || []).map(tag => tag.value);

    [id, ...any].map(tag => {
      this.disconnects.push(dispatch(connectHashtagStream(id, tag, status => {
        let tags = status.tags.map(tag => tag.name);

        return all.filter(tag => tags.includes(tag)).length === all.length &&
               none.filter(tag => tags.includes(tag)).length === 0;
      })));
    });
  }

  _unsubscribe () {
    this.disconnects.map(disconnect => disconnect());
    this.disconnects = [];
  }

  componentDidMount () {
    const { dispatch } = this.props;
    const { id, tags } = this.props.params;

    this._subscribe(dispatch, id, tags);
    dispatch(expandHashtagTimeline(id, { tags }));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, params } = this.props;
    const { id, tags } = nextProps.params;

    if (id !== params.id || !isEqual(tags, params.tags)) {
      this._unsubscribe();
      this._subscribe(dispatch, id, tags);
      this.props.dispatch(clearTimeline(`hashtag:${id}`));
      this.props.dispatch(expandHashtagTimeline(id, { tags }));
    }
  }

  componentWillUnmount () {
    this._unsubscribe();
  }

  handleLoadMore = maxId => {
    const { id, tags } = this.props.params;
    this.props.dispatch(expandHashtagTimeline(id, { maxId, tags }));
  }

  render () {
    const { hasUnread, columnId } = this.props;
    const { id } = this.props.params;

    return (
      <Column label={`#${id}`}>
        <ColumnHeader icon='hashtag' active={hasUnread} title={this.title()}>
          {columnId && <ColumnSettingsContainer columnId={columnId} />}
        </ColumnHeader>

        <StatusListContainer
          scrollKey={`hashtag_timeline-${columnId}`}
          timelineId={`hashtag:${id}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
        />
      </Column>
    );
  }

}

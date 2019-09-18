import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchGroups } from '../../../actions/groups';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import GroupCard from './card';
import GroupCreate from '../create';
import { me } from 'gabsocial/initial_state';
import { openModal } from '../../../actions/modal';

const messages = defineMessages({
	heading: { id: 'column.groups', defaultMessage: 'Groups' },
	create: { id: 'groups.create', defaultMessage: 'Create group' },
	tab_featured: { id: 'groups.tab_featured', defaultMessage: 'Featured' },
	tab_member: { id: 'groups.tab_member', defaultMessage: 'Member' },
	tab_admin: { id: 'groups.tab_admin', defaultMessage: 'Manage' },
});

const mapStateToProps = (state, { activeTab }) => ({
	groupIds: state.getIn(['group_lists', activeTab]),
	account: state.getIn(['accounts', me]),
});

export default @connect(mapStateToProps)
@injectIntl
class Groups extends ImmutablePureComponent {
	static propTypes = {
		params: PropTypes.object.isRequired,
		activeTab: PropTypes.string.isRequired,
		showCreateForm: PropTypes.bool,
		dispatch: PropTypes.func.isRequired,
		groups: ImmutablePropTypes.map,
		groupIds: ImmutablePropTypes.list,
		intl: PropTypes.object.isRequired,
	};

	componentWillMount () {
		this.props.dispatch(fetchGroups(this.props.activeTab));
	}

	componentDidUpdate(oldProps) {
		if (this.props.activeTab && this.props.activeTab !== oldProps.activeTab) {
			this.props.dispatch(fetchGroups(this.props.activeTab));
		}
	}

	handleOpenProUpgradeModal = () => {
		this.props.dispatch(openModal('PRO_UPGRADE'));
	}

	renderHeader() {
		const { intl, activeTab, account, onOpenProUpgradeModal } = this.props;

		const isPro = account.get('is_pro');

		return (
			<div className="group-column-header">
				<div className="group-column-header__cta">
					{
						account && isPro &&
						<Link to="/groups/create" className="button standard-small">{intl.formatMessage(messages.create)}</Link>
					}
					{
						account && !isPro &&
						<button onClick={this.handleOpenProUpgradeModal} className="button standard-small">{intl.formatMessage(messages.create)}</button>
					}
				</div>
				<div className="group-column-header__title">{intl.formatMessage(messages.heading)}</div>

				<div className="column-header__wrapper">
					<h1 className="column-header">
						<Link to='/groups' className={classNames('btn grouped', {'active': 'featured' === activeTab})}>
							{intl.formatMessage(messages.tab_featured)}
						</Link>

						<Link to='/groups/browse/member' className={classNames('btn grouped', {'active': 'member' === activeTab})}>
							{intl.formatMessage(messages.tab_member)}
						</Link>

						<Link to='/groups/browse/admin' className={classNames('btn grouped', {'active': 'admin' === activeTab})}>
							{intl.formatMessage(messages.tab_admin)}
						</Link>
					</h1>
				</div>
			</div>
		);
	}

	render () {
		const { groupIds, showCreateForm } = this.props;

		return (
			<div>
				{!showCreateForm && this.renderHeader()}
				{showCreateForm && <GroupCreate /> }

				<div className="group-card-list">
					{groupIds.map(id => <GroupCard key={id} id={id} />)}
				</div>
			</div>
		);
	}
}
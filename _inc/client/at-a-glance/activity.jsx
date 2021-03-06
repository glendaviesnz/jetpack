/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashItem from 'components/dash-item';
import Card from 'components/card';
import { translate as __ } from 'i18n-calypso';
// import { get, includes } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { getSitePlan } from 'state/site';
import { isDevMode } from 'state/connection';
//import { PLAN_JETPACK_BUSINESS, PLAN_JETPACK_BUSINESS_MONTHLY, PLAN_VIP } from 'lib/plans/constants';

class DashActivity extends Component {
	static propTypes = {
		inDevMode: PropTypes.bool.isRequired,
		siteRawUrl: PropTypes.string.isRequired,
		sitePlan: PropTypes.object.isRequired,
	};

	static defaultProps = {
		inDevMode: false,
		siteRawUrl: '',
		sitePlan: '',
	};

	render() {
		const { inDevMode } = this.props;
		// const sitePlan = get( this.props.sitePlan, 'product_slug', 'jetpack_free' );
		// const hasBackups = includes( [ PLAN_JETPACK_BUSINESS, PLAN_JETPACK_BUSINESS_MONTHLY, PLAN_VIP ], sitePlan );
		// const maybeUpgrade = hasBackups
		// 	? __( "{{a}}View your site's activity{{/a}} in a single feed where you can see when events occur and rewind them if you need to.", {
		// 		components: {
		// 			a: activityLogLink
		// 		}
		// 	} )
		// 	: __( "{{a}}View your site's activity{{/a}} in a single feed where you can see when events occur and, {{plan}}with a plan{{/plan}}, rewind them if you need to.", {
		// 		components: {
		// 			a: activityLogLink,
		// 			plan: <a href={ `https://jetpack.com/redirect/?source=plans-main-bottom&site=${ siteRawUrl }` } />
		// 		}
		// 	} );

		// @todo: update this to use rewind text/CTA when available
		const activityLogOnlyText = __(
			'Jetpack keeps a complete record of everything that happens on your site, taking the guesswork out of site management, debugging, and repair.'
		);

		return (
			<div className="jp-dash-item__interior">
				<DashItem
					label={ __( 'Activity' ) }
					isModule={ false }
					className={ classNames( {
						'jp-dash-item__is-inactive': inDevMode,
					} ) }
					pro={ false }
				>
					<p className="jp-dash-item__description">
						{ inDevMode ? __( 'Unavailable in Dev Mode.' ) : activityLogOnlyText }
					</p>
				</DashItem>
				<Card
					key="view-activity"
					className="jp-dash-item__manage-in-wpcom"
					compact
					href={ `https://wordpress.com/activity-log/${ this.props.siteRawUrl }` }
				>
					{ __( 'View site activity' ) }
				</Card>
			</div>
		);
	}
}

export default connect( state => ( {
	sitePlan: getSitePlan( state ),
	inDevMode: isDevMode( state ),
} ) )( DashActivity );

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import attributes from './attributes';
import edit from './edit';
import icon from './icon';

/**
 * Style dependencies
 */
import './editor.scss';

export const name = 'calendly';
export const title = __( 'Calendly', 'jetpack' );
export const settings = {
	title,

	description: (
		<Fragment>
			<p>{ __( 'Embed a calendar for customers to schedule appointments', 'jetpack' ) }</p>
		</Fragment>
	),

	icon,

	category: 'jetpack',

	keywords: [ 'calendar', 'schedule', 'appointments' ],

	supports: {
		html: false,
	},

	edit,

	save: () => null,

	attributes,
};

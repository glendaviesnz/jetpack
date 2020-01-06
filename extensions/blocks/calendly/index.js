/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';
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
			<p>{ __( 'Calendly', 'jetpack' ) }</p>
			<ExternalLink href="#">{ __( 'Learn more about Calendly', 'jetpack' ) }</ExternalLink>
		</Fragment>
	),

	/* @TODO Add the icon. You can use one of these https://material.io/tools/icons/?style=outline */
	icon,

	category: 'jetpack',

	keywords: [],

	supports: {
		html: false,
	},

	edit,

	/* @TODO Write the block editor output */
	save: () => null,

	example: {
		attributes: {
			// @TODO: Add default values for block attributes, for generating the block preview.
		},
	},

	attributes,
};

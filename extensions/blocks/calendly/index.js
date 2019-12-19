/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink, Path } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import renderMaterialIcon from '../../shared/render-material-icon';
import edit from './edit';
import attributeDetails, { getValidatedAttributes } from './attributes';

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
	icon: renderMaterialIcon(
		<Path d="M9 15h2V9H9v6zm1-10c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm0-4c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z" />
	),

	category: 'jetpack',

	keywords: [],

	supports: {
		html: false,
	},

	edit,

	/* @TODO Write the block editor output */
	save: ( { attributes } ) => {
		attributes = getValidatedAttributes( attributeDetails, attributes );
		return null;
	},

	example: {
		attributes: {
			// @TODO: Add default values for block attributes, for generating the block preview.
		},
	},

	attributes: attributeDetails,
};

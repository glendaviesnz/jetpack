<?php
/**
 * Calendly Block.
 *
 * @since 8.x
 *
 * @package Jetpack
 */

jetpack_register_block(
	'jetpack/calendly',
	array( 'render_callback' => 'jetpack_calendly_block_load_assets' )
);

/**
 * Calendly block registration/dependency declaration.
 *
 * @param array  $attr    Array containing the Calendly block attributes.
 * @param string $content String containing the Calendly block content.
 *
 * @return string
 */
function jetpack_calendly_block_load_assets( $attr, $content ) {
	Jetpack_Gutenberg::load_assets_as_required( 'calendly' );
	return $content;
}

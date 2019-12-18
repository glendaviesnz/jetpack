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
	$url = jetpack_calendly_block_get_attribute( $attr, 'url' );
	if ( empty( $url ) ) {
		return;
	}

	$type                    = jetpack_calendly_block_get_attribute( $attr, 'type' );
	$button_text             = jetpack_calendly_block_get_attribute( $attr, 'buttonText' );
	$background_color        = jetpack_calendly_block_get_attribute( $attr, 'backgroundColor' );
	$text_color              = jetpack_calendly_block_get_attribute( $attr, 'textColor' );
	$primary_color           = jetpack_calendly_block_get_attribute( $attr, 'primaryColor' );
	$hide_event_type_details = jetpack_calendly_block_get_attribute( $attr, 'hideEventTypeDetails' );

	$url = add_query_arg(
		array(
			'hide_event_type_details' => (int) $hide_event_type_details,
			'background_color'        => $background_color,
			'text_color'              => $text_color,
			'primary_color'           => $primary_color,
		),
		$url
	);

	switch ( $type ) {
		case 'inline':
			$content  = '<div class="calendly-inline-widget" data-url="' . $url . '" style="min-width:320px;height:630px;"></div>';
			$content .= '<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>';
			break;
		case 'link':
			$settings = "{url: '" . $url . "'}";
			$content  = '<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">';
			$content .= '<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>';
			$content .= '<div><a href="" onclick="Calendly.initPopupWidget(' . $settings . ');return false;">' . $button_text . '</a></div>';
			break;
	}
	return $content;
}

/**
 * Get filtered attributes.
 *
 * @param array  $attributes     Array containing the Calendly block attributes.
 * @param string $attribute_name String containing the attribute name to get.
 *
 * @return string
 */
function jetpack_calendly_block_get_attribute( $attributes, $attribute_name ) {
	if ( isset( $attributes[ $attribute_name ] ) ) {
		return wp_kses( $attributes[ $attribute_name ], array() );
	}

	$default_attributes = array(
		'type'                 => 'inline',
		'buttonText'           => 'Schedule time with me',
		'backgroundColor'      => 'ffffff',
		'textColor'            => '4D5055',
		'primaryColor'         => '00A2FF',
		'hideEventTypeDetails' => false,
	);

	return $default_attributes[ $attribute_name ];
}

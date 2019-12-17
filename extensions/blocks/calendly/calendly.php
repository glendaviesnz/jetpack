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
	$type        = jetpack_calendly_block_get_attribute( $attr, 'type' );
	$url         = jetpack_calendly_block_get_attribute( $attr, 'url' );
	$button_text = jetpack_calendly_block_get_attribute( $attr, 'buttonText' );
	$color       = jetpack_calendly_block_get_attribute( $attr, 'color' );
	$text_color  = jetpack_calendly_block_get_attribute( $attr, 'textColor' );
	$branding    = jetpack_calendly_block_get_attribute( $attr, 'branding' );

	switch ( $type ) {
		case 'inline':
			$content  = '<div class="calendly-inline-widget" data-url="' . $url . '" style="min-width:320px;height:630px;"></div>';
			$content .= '<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>';
			break;
		case 'badge':
			$settings_object = "{ url: '" . $url . "', text: '" . $button_text . "', color: '" . $color . "', textColor: '" . $text_color . "', branding: " . $branding . ' }';
			$content         = '<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">';
			$content        .= '<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>';
			$content        .= '<script type="text/javascript">Calendly.initBadgeWidget(' . $settings_object . ');</script>';
			break;
		case 'link':
			$settings_object = "{url: '" . $url . "'}";
			$content         = '<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">';
			$content        .= '<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>';
			$content        .= '<a href="" onclick="Calendly.initPopupWidget(' . $settings_object . ');return false;">' . $button_text . '</a>';
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
		'type'       => 'badge',
		'url'        => 'https://calendly.com/scruffian/usability-test',
		'buttonText' => 'Schedule time with me',
		'color'      => '#00a2ff',
		'textColor'  => '#ffffff',
		'branding'   => true,
	);

	return $default_attributes[ $attribute_name ];
}

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { isEqual } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	Button,
	ExternalLink,
	Notice,
	PanelBody,
	Placeholder,
	ToggleControl,
	Toolbar,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';
import attributeDetails, { getValidatedAttributes } from './attributes';
import SubmitButton from '../../shared/submit-button';

const getUrlAndStyleFromEmbedCode = embedCode => {
	if ( embedCode.indexOf( 'http' ) === 0 ) {
		return {
			style: 'inline',
			url: embedCode,
		};
	}

	let urlFromRegex = embedCode.match( / *data-url *= *["']?([^"']*)/i );
	if ( urlFromRegex && urlFromRegex[ 1 ] && urlFromRegex[ 1 ].indexOf( 'http' ) === 0 ) {
		return {
			style: 'inline',
			url: urlFromRegex[ 1 ],
		};
	}

	urlFromRegex = embedCode.match( / *Calendly\.initPopupWidget\({ *url: *["']?([^"']*)/i );
	if ( urlFromRegex && urlFromRegex[ 1 ] && urlFromRegex[ 1 ].indexOf( 'http' ) === 0 ) {
		return {
			style: 'link',
			url: urlFromRegex[ 1 ],
		};
	}

	urlFromRegex = embedCode.match( / *Calendly\.initBadgeWidget\({ *url: *["']?([^"']*)/i );
	if ( urlFromRegex && urlFromRegex[ 1 ] && urlFromRegex[ 1 ].indexOf( 'http' ) === 0 ) {
		return {
			style: 'link',
			url: urlFromRegex[ 1 ],
		};
	}
};

const getNewAttributesFromUrl = ( { url, style } ) => {
	const attributes = { style };
	const urlObject = new URL( url );
	attributes.url = urlObject.origin + urlObject.pathname;

	if ( ! urlObject.search ) {
		return attributes;
	}

	const searchParams = new URLSearchParams( urlObject.search );
	const backgroundColor = searchParams.get( 'background_color' );
	const primaryColor = searchParams.get( 'primary_color' );
	const textColor = searchParams.get( 'text_color' );
	const hexRegex = /^[A-Za-z0-9]{6}$/;

	if ( searchParams.get( 'hide_event_type_details' ) ) {
		attributes.hideEventTypeDetails = searchParams.get( 'hide_event_type_details' );
	}

	if ( backgroundColor && backgroundColor.match( hexRegex ) ) {
		attributes.backgroundColor = backgroundColor;
	}

	if ( primaryColor && primaryColor.match( hexRegex ) ) {
		attributes.primaryColor = primaryColor;
	}

	if ( textColor && textColor.match( hexRegex ) ) {
		attributes.textColor = textColor;
	}

	return getValidatedAttributes( attributeDetails, attributes );
};

export default function CalendlyEdit( { attributes, className, setAttributes } ) {
	const validatedAttributes = getValidatedAttributes( attributeDetails, attributes );

	if ( ! isEqual( validatedAttributes, attributes ) ) {
		setAttributes( validatedAttributes );
	}

	const {
		backgroundColor,
		submitButtonText,
		hideEventTypeDetails,
		primaryColor,
		textColor,
		style,
		url,
	} = validatedAttributes;
	const [ embedCode, setEmbedCode ] = useState();
	const [ notice, setNotice ] = useState();

	const setErrorNotice = () =>
		setNotice(
			<>
				{ __(
					"Your calendar couldn't be embedded. Please double check your URL or code.",
					'jetpack'
				) }
			</>
		);

	const parseEmbedCode = event => {
		if ( ! event ) {
			setErrorNotice();
			return;
		}

		event.preventDefault();

		if ( ! embedCode ) {
			setErrorNotice();
			return;
		}

		const newUrlAndStyle = getUrlAndStyleFromEmbedCode( embedCode );
		if ( ! newUrlAndStyle ) {
			setErrorNotice();
			return;
		}

		setAttributes( getNewAttributesFromUrl( newUrlAndStyle ) );
	};

	const embedCodeForm = (
		<form onSubmit={ parseEmbedCode }>
			<input
				type="text"
				id="embedCode"
				onChange={ event => setEmbedCode( event.target.value ) }
				placeholder={ __( 'Calendly web address or embed code…' ) }
				value={ embedCode }
				className="components-placeholder__input"
			/>
			<div>
				<Button isLarge type="submit">
					{ _x( 'Embed', 'button label', 'jetpack' ) }
				</Button>
			</div>
			<p>
				<ExternalLink
					href="https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview"
					target="_blank"
				>
					{ __( 'Need help finding your embed code?' ) }
				</ExternalLink>
			</p>
		</form>
	);

	const blockPlaceholder = (
		<Placeholder
			label={ __( 'Calendly', 'jetpack' ) }
			instructions={ __( 'Enter your Calendly web address or embed code below.', 'jetpack' ) }
			icon={ <BlockIcon icon={ icon } /> }
			notices={
				notice && (
					<Notice status="error" isDismissible={ false }>
						{ notice }
					</Notice>
				)
			}
		>
			{ embedCodeForm }
		</Placeholder>
	);

	const iframeSrc = () => {
		let src = url + '?embed_domain=wordpress.com&amp;embed_type=Inline';
		src += '&amp;hide_event_type_details=' + ( hideEventTypeDetails ? 1 : 0 );
		src += '&amp;background_color=' + backgroundColor;
		src += '&amp;primary_color=' + primaryColor;
		src += '&amp;text_color=' + textColor;
		return src;
	};

	const inlinePreview = (
		<>
			<div className={ `${ className }-overlay` }></div>
			<iframe
				src={ iframeSrc() }
				width="100%"
				height="100%"
				frameborder="0"
				data-origwidth="100%"
				data-origheight="100%"
				style={ { minWidth: '320px', height: '630px', width: '100%' } }
				title="Calendly"
			></iframe>
		</>
	);

	const submitButtonPreview = (
		<SubmitButton
			submitButtonText={ submitButtonText }
			attributes={ attributes }
			setAttributes={ setAttributes }
		/>
	);

	const linkPreview = (
		<>
			<a style={ { alignSelf: 'flex-start', border: 'none' } } class="wp-block-button__link">
				{ submitButtonText }
			</a>
		</>
	);

	const blockPreview = ( previewStyle, disabled ) => {
		if ( previewStyle === 'inline' ) {
			return inlinePreview;
		}

		if ( disabled ) {
			return linkPreview;
		}

		return submitButtonPreview;
	};

	const styleOptions = [
		{ value: 'inline', label: __( 'Inline', 'jetpack' ) },
		{ value: 'link', label: __( 'Link', 'jetpack' ) },
	];

	const blockControls = (
		<BlockControls>
			{ url && (
				<Toolbar
					isCollapsed={ true }
					icon="admin-appearance"
					label={ __( 'Style', 'jetpck' ) }
					controls={ styleOptions.map( styleOption => ( {
						title: styleOption.label,
						isActive: styleOption.value === style,
						onClick: () => setAttributes( { style: styleOption.value } ),
					} ) ) }
				/>
			) }
		</BlockControls>
	);

	const inspectorControls = (
		<InspectorControls>
			{ url && (
				<>
					<PanelBody title={ __( 'Styles', 'jetpack' ) }>
						<div className="block-editor-block-styles">
							{ styleOptions.map( styleOption => {
								return (
									<div
										key={ styleOption.value }
										className={ classnames( 'block-editor-block-styles__item is-calendly', {
											'is-active': styleOption.value === style,
										} ) }
										onClick={ () => {
											setAttributes( { style: styleOption.value } );
										} }
										onKeyDown={ event => {
											if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
												event.preventDefault();
												setAttributes( { style: styleOption.value } );
											}
										} }
										role="button"
										tabIndex="0"
										aria-label={ styleOption.label }
									>
										<div className="block-editor-block-styles__item-preview editor-styles-wrapper is-calendly">
											{ blockPreview( styleOption.value, true ) }
										</div>
										<div className="block-editor-block-styles__item-label">
											{ styleOption.label }
										</div>
									</div>
								);
							} ) }
						</div>
					</PanelBody>

					<PanelColorSettings
						title={ __( 'Embed Color Settings', 'jetpack' ) }
						colorSettings={ [
							{
								value: '#' + backgroundColor,
								onChange: nextColor => setAttributes( { backgroundColor: nextColor.substr( 1 ) } ),
								label: __( 'Background Color', 'jetpack' ),
							},
							{
								value: '#' + primaryColor,
								onChange: nextColor => setAttributes( { primaryColor: nextColor.substr( 1 ) } ),
								label: __( 'Primary Color', 'jetpack' ),
							},
							{
								value: '#' + textColor,
								onChange: nextColor => setAttributes( { textColor: nextColor.substr( 1 ) } ),
								label: __( 'Text Color', 'jetpack' ),
							},
						] }
					/>
				</>
			) }

			<PanelBody title={ __( 'Calendar Settings', 'jetpack' ) } initialOpen={ false }>
				<form onSubmit={ parseEmbedCode } className={ `${ className }-embed-form-sidebar` }>
					<input
						type="text"
						id="embedCode"
						onChange={ event => setEmbedCode( event.target.value ) }
						placeholder={ __( 'Calendly web address or embed code…' ) }
						value={ embedCode }
						className="components-placeholder__input"
					/>
					<div>
						<Button isLarge type="submit">
							{ _x( 'Embed', 'button label', 'jetpack' ) }
						</Button>
					</div>
				</form>

				<ToggleControl
					label={ __( 'Hide Event Type Details', 'jetpack' ) }
					checked={ hideEventTypeDetails }
					onChange={ () => setAttributes( { hideEventTypeDetails: ! hideEventTypeDetails } ) }
				/>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{ inspectorControls }
			{ blockControls }
			{ url ? blockPreview( style ) : blockPlaceholder }
		</>
	);
}

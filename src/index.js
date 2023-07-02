import { useState } from '@wordpress/element';
import { useCommand } from '@wordpress/commands';
import { registerPlugin } from '@wordpress/plugins';
import { image, external, commentAuthorAvatar } from '@wordpress/icons';
import { Modal, Button, TextControl } from '@wordpress/components';

const UserModal = ( props ) => {
	return (
		<>
			<Modal
				title="Add New User"
				onRequestClose={ () => {
					props.onRequestClose();
				}}
				shouldCloseOnClickOutside={ false }
				shouldCloseOnEsc={ false }
			>
				<TextControl
					label="Username"
					placeholder="Enter username"
				/>
				<TextControl
					label="Email"
					placeholder="Enter email"
				/>
				<Button
					variant="primary"
					onClick={ () => {
						// Do ajax or rest call to save user.
						props.onRequestClose();
					}}
				>
					Save User
				</Button>
				<Button
					variant="secondary"
					onClick={ () => {
						props.onRequestClose();
					}}
				>
					Cancel
				</Button>
			</Modal>
		</>
	);
};

const FeaturedImageCommand = () => {
	// For showing the add user modal.
	const [ isAddUserModalOpen, setIsAddUserModalOpen ] = useState( false );

	// Get the current post type
	const postType = wp.data.select("core/editor").getCurrentPostType();

	// Get the post type object
	const postTypeObject = wp.data.select("core").getPostType(postType);

	// If post type does not support thumbnails, exit.
	if ( postTypeObject.supports && ! postTypeObject.supports.thumbnail) {
		return null;
	}

	// Set up the command for adding a featured image.
	useCommand( {
		name: 'add-featured-image',
		label: 'Add Featured Image',
		icon: image,
		callback: () => {
			const uploader = wp.media({
				states: [
					new wp.media.controller.Library({
						title: "Set Featured Image",
						library: wp.media.query({type: 'image'}),
						multiple: false,
						date: false,
						priority: 20,
						syncSelection: true,
					}),
				],
				title: "Set Featured Image",
				button: {
					text: "Set Featured Image",
				},
				multiple: false,
			});
			
			//For when the Add Profile Image is clicked
			uploader.on('select', function () {
				const featured = uploader.state().get('selection').single();
				if ( ! featured.id ) {
					return;
				}
				// Set the post featured id.
				wp.data.dispatch( 'core/editor' ).editPost( { featured_media: featured.id } );
			});

			// For when the uploader is opened.
			uploader.on('open', function () {
				// Select the current featured image if there is one.
				const featuredImageId = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'featured_media' );
				if ( featuredImageId ) {
					const attachment = wp.media.attachment(featuredImageId);
					attachment.fetch();
					const selection = uploader.state('library').get('selection');
					selection.add( attachment );
				}
			} );

			// Open media library.
			uploader.open();
		},
		context: 'block-editor',
	} );

	// Set up a command for going to the refresh permalinks screen.
	useCommand( {
		name: 'refresh-permalinks',
		label: 'Go to Refresh Permalinks Settings Screen',
		icon: external,
		callback: () => {
			document.location.href = 'options-permalink.php';
		},
		context: 'block-editor'
	} );

	// Set up a command for showing a modal for adding a user.
	useCommand( {
		name: 'add-new-user',
		label: 'Add New User',
		icon: commentAuthorAvatar,
		callback: () => {
			setIsAddUserModalOpen( true );
		},
		context: 'block-editor'
	} );

	if ( isAddUserModalOpen ) {
		return (
			<UserModal
				onRequestClose={ () => {
					setIsAddUserModalOpen( false );
				}}
			/>
		);
	}

	return null;
}
registerPlugin( 'dlx-command-add-featured-image', { render: FeaturedImageCommand } );

export default FeaturedImageCommand;
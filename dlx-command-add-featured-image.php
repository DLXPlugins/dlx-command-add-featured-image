<?php
/**
 * Plugin Name: DLX Command - Add Featured Image
 * Plugin URI: https://dlxplugins.com/plugins/
 * Description: Demonstrates adding a new command to the WordPress command palette.
 * Author: DLX Plugins
 * Version: 0.0.1
 * Requires at least: 5.1
 * Requires PHP: 7.2
 * Author URI: https://dlxplugins.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package DLXCommandAddFeaturedImage
 */

namespace DLXPlugins\DLXCommandAddFeaturedImage;

// Enqueue block editor assets.
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_assets' );

/**
 * Enqueue block editor assets.
 *
 * @return void
 */
function enqueue_block_editor_assets() {
	wp_enqueue_script(
		'dlx-command-add-featured-image',
		plugins_url( 'build/index.js', __FILE__ ),
		array(),
		'1.0.0',
		true
	);
}


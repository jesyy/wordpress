<?php
/**
 * Update/Install Plugin/Theme administration panel.
 *
 * @package WordPress
 * @subpackage Administration
 */

/** WordPress Administration Bootstrap */
require_once('admin.php');

include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

if ( isset($_GET['action']) ) {
	$plugin = isset($_REQUEST['plugin']) ? trim($_REQUEST['plugin']) : '';
	$theme = isset($_REQUEST['theme']) ? urldecode($_REQUEST['theme']) : '';
	$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

	if ( 'upgrade-plugin' == $action ) {
		if ( ! current_user_can('update_plugins') )
			wp_die(__('You do not have sufficient permissions to update plugins for this blog.'));

		check_admin_referer('upgrade-plugin_' . $plugin);

		$title = __('Upgrade Plugin');
		$parent_file = 'plugins.php';
		$submenu_file = 'plugins.php';
		require_once('admin-header.php');

		$nonce = 'upgrade-plugin_' . $plugin;
		$url = 'update.php?action=upgrade-plugin&plugin=' . $plugin;

		$upgrader = new Plugin_Upgrader( new Plugin_Upgrader_Skin( compact('title', 'nonce', 'url', 'plugin') ) );
		$upgrader->upgrade($plugin);

		include('admin-footer.php');
		
	} elseif ('activate-plugin' == $action ) {
		if ( ! current_user_can('update_plugins') )
			wp_die(__('You do not have sufficient permissions to update plugins for this blog.'));

		check_admin_referer('activate-plugin_' . $plugin);
		if( ! isset($_GET['failure']) && ! isset($_GET['success']) ) {
			wp_redirect( 'update.php?action=activate-plugin&failure=true&plugin=' . $plugin . '&_wpnonce=' . $_GET['_wpnonce'] );
			activate_plugin($plugin);
			wp_redirect( 'update.php?action=activate-plugin&success=true&plugin=' . $plugin . '&_wpnonce=' . $_GET['_wpnonce'] );
			die();
		}
		iframe_header( __('Plugin Reactivation'), true );
		if( isset($_GET['success']) )
			echo '<p>' . __('Plugin reactivated successfully.') . '</p>';

		if( isset($_GET['failure']) ){
			echo '<p>' . __('Plugin failed to reactivate due to a fatal error.') . '</p>';
			error_reporting( E_ALL ^ E_NOTICE );
			@ini_set('display_errors', true); //Ensure that Fatal errors are displayed.
			include(WP_PLUGIN_DIR . '/' . $plugin);
		}
		iframe_footer();
	} elseif ( 'install-plugin' == $action ) {

		if ( ! current_user_can('install_plugins') )
			wp_die(__('You do not have sufficient permissions to install plugins for this blog.'));

		include_once ABSPATH . 'wp-admin/includes/plugin-install.php'; //for plugins_api..
	
		check_admin_referer('install-plugin_' . $plugin);
		$api = plugins_api('plugin_information', array('slug' => $plugin, 'fields' => array('sections' => false) ) ); //Save on a bit of bandwidth.
	
		if ( is_wp_error($api) )
	 		wp_die($api);
	
		$title = __('Plugin Install');
		$parent_file = 'plugins.php';
		$submenu_file = 'plugin-install.php';
		require_once('admin-header.php');
	
		$title = sprintf( __('Installing Plugin: %s'), $api->name . ' ' . $api->version );
		$nonce = 'install-plugin_' . $plugin;
		$url = add_query_arg( array(
								'plugin' => $plugin,
								'plugin_name' => $api->name . ' ' . $api->version,
								'download_url' => $api->download_link
							), 'update.php?action=install-plugin');
		$type = 'web'; //Install plugin type, From Web or an Upload.

		$upgrader = new Plugin_Upgrader( new Plugin_Installer_Skin( compact('title', 'url', 'nonce', 'plugin', 'api') ) );
		$upgrader->install($api->download_link);
		
		include('admin-footer.php');

	} elseif ( 'upload-plugin' == $action ) {

		if ( ! current_user_can('install_plugins') )
			wp_die(__('You do not have sufficient permissions to install plugins for this blog.'));

		check_admin_referer('plugin-upload');

		$file_upload = new File_Upload_Upgrader('pluginzip', 'package');

		$title = __('Upload Plugin');
		$parent_file = 'plugins.php';
		$submenu_file = 'plugin-install.php';
		require_once('admin-header.php');
		
		$title = sprintf( __('Installing Plugin from uploaded file: %s'), basename( $file_upload->filename ) );
		$nonce = 'plugin-upload';
		$url = add_query_arg(array('package' => $file_upload->filename ), 'update.php?action=upload-plugin');
		$type = 'upload'; //Install plugin type, From Web or an Upload.

		$upgrader = new Plugin_Upgrader( new Plugin_Installer_Skin( compact('type', 'title', 'nonce', 'url') ) );
		$upgrader->install( $file_upload->package );

		include('admin-footer.php');

	} elseif ( 'upgrade-theme' == $action ) {

		if ( ! current_user_can('update_themes') )
			wp_die(__('You do not have sufficient permissions to update themes for this blog.'));

		check_admin_referer('upgrade-theme_' . $theme);

		add_thickbox();
		wp_enqueue_script('theme-preview');
		$title = __('Upgrade Theme');
		$parent_file = 'themes.php';
		$submenu_file = 'themes.php';
		require_once('admin-header.php');

		$nonce = 'upgrade-theme_' . $theme;
		$url = 'update.php?action=upgrade-theme&theme=' . $theme;

		$upgrader = new Theme_Upgrader( new Theme_Upgrader_Skin( compact('title', 'nonce', 'url', 'theme') ) );
		$upgrader->upgrade($theme);

		include('admin-footer.php');
	
	} elseif ( 'install-theme' == $action ) {

		if ( ! current_user_can('install_themes') )
			wp_die(__('You do not have sufficient permissions to install themes for this blog.'));

		include_once ABSPATH . 'wp-admin/includes/theme-install.php'; //for themes_api..
	
		check_admin_referer('install-theme_' . $theme);
		$api = themes_api('theme_information', array('slug' => $theme, 'fields' => array('sections' => false) ) ); //Save on a bit of bandwidth.

		if ( is_wp_error($api) )
	 		wp_die($api);

		add_thickbox();
		wp_enqueue_script('theme-preview');
		$title = __('Install Themes');
		$parent_file = 'themes.php';
		$submenu_file = 'theme-install.php';
		require_once('admin-header.php');
	
		$title = sprintf( __('Installing theme: %s'), $api->name . ' ' . $api->version );
		$nonce = 'install-theme_' . $theme;
		$url = add_query_arg( array(
								'theme' => $theme,
								'theme_name' => $api->name . ' ' . $api->version,
								'download_url' => $api->download_link
							), 'update.php?action=install-theme');
		$type = 'web'; //Install theme type, From Web or an Upload.
	
		$upgrader = new Theme_Upgrader( new Theme_Installer_Skin( compact('title', 'url', 'nonce', 'plugin', 'api') ) );
		$upgrader->install($api->download_link);
		
		include('admin-footer.php');
		
	} elseif ( 'upload-theme' == $action ) {

		if ( ! current_user_can('install_themes') )
			wp_die(__('You do not have sufficient permissions to install themes for this blog.'));

		check_admin_referer('theme-upload');

		$file_upload = new File_Upload_Upgrader('themezip', 'package');

		$title = __('Upload Theme');
		$parent_file = 'themes.php';
		$submenu_file = 'theme-install.php';
		add_thickbox();
		wp_enqueue_script('theme-preview');
		require_once('admin-header.php');

		$title = sprintf( __('Installing Theme from uploaded file: %s'), basename( $file_upload->filename ) );
		$nonce = 'theme-upload';
		$url = add_query_arg(array('package' => $file_upload->filename), 'update.php?action=upload-theme');
		$type = 'upload'; //Install plugin type, From Web or an Upload.

		$upgrader = new Theme_Upgrader( new Theme_Installer_Skin( compact('type', 'title', 'nonce', 'url') ) );
		$upgrader->install( $file_upload->package );

		include('admin-footer.php');

	} else {
		do_action('update-custom_' . $action);
	}
}
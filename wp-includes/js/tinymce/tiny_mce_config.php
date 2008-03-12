<?php 
// some code below is from:
/**
 * $Id: tiny_mce_gzip.php 315 2007-10-25 14:03:43Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright � 2005-2006, Moxiecode Systems AB, All rights reserved.
 *
 * This file compresses the TinyMCE JavaScript using GZip.
 **/
  
@ require('../../../wp-config.php');

function getFileContents($path) {
	$path = realpath($path);

	if ( ! $path || ! @is_file($path) )
		return '';

	if ( function_exists('file_get_contents') )
		return @file_get_contents($path);

	$content = '';
	$fp = @fopen($path, 'r');
	if ( ! $fp )
		return '';

	while ( ! feof($fp) )
		$content .= fgets($fp);

	fclose($fp);
	return $content;
}

function putFileContents( $path, $content ) {
	if ( function_exists('file_put_contents') )
		return @file_put_contents( $path, $content );

	$fp = @fopen( $path, 'wb' );
	if ($fp) {
		fwrite( $fp, $content );
		fclose($fp);
	}
}

// Set up init variables
$https = ( isset($_SERVER['HTTPS']) && 'on' == strtolower($_SERVER['HTTPS']) ) ? true : false;
	
$baseurl = get_option('siteurl') . '/wp-includes/js/tinymce';
if ( $https ) str_replace('http://', 'https://', $baseurl);

$mce_css = $baseurl . '/wordpress.css';
$mce_css = apply_filters('mce_css', $mce_css);
if ( $https ) str_replace('http://', 'https://', $mce_css);

/*
Setting mce_valid_elements to *[*] skips all of the internal cleanup and can cause problems.
The minimal setting would be -strong/-b[*],-em/-i[*],*[*].
Best is to use the default cleanup by not specifying mce_valid_elements,
and then use extended_valid_elements to add to it.
*/
$valid_elements = apply_filters('mce_valid_elements', '');
$invalid_elements = apply_filters('mce_invalid_elements', '');

$extended_valid_elements = '@[id|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],bdo,code,col[*],colgroup[*],dfn,fieldset,form[*],input[*],kbd,label[*],legend[*],noscript,optgroup[*],option[*],q[cite|class],samp,textarea[*],title,var';

$extended_valid_elements = apply_filters('mce_extended_valid_elements', $extended_valid_elements);

/*
The following filter allows localization scripts to change the languages displayed in the spellchecker's drop-down menu.
By default it uses Google's spellchecker API, but can be configured to use PSpell/ASpell if installed on the server.
The + sign marks the default language.
More information:
http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/spellchecker
*/
$mce_spellchecker_languages = apply_filters('mce_spellchecker_languages', '+English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr,German=de,Italian=it,Polish=pl,Portuguese=pt,Spanish=es,Swedish=sv');

$plugins = array( 'safari', 'inlinepopups', 'autosave', 'spellchecker', 'paste', 'wordpress', 'media', 'fullscreen' );

/* 
The following filter takes an associative array of external plugins for TinyMCE in the form "name" => "url".
It adds the plugin's name to TinyMCE's plugins init and the call to PluginManager to load the plugin. 
The url should be absolute and should include the js file name to be loaded. 
Example: array( 'myplugin' => 'http://my-site.com/wp-content/plugins/myfolder/mce_plugin.js' ). 
If the plugin uses a button, it should be added with one of the "$mce_buttons" filters.
*/
$mce_external_plugins = apply_filters('mce_external_plugins', array()); 

$ext_plugins = "\n";
if ( ! empty($mce_external_plugins) ) {
	foreach ( $mce_external_plugins as $name => $url ) {
		if ( $https ) str_replace('http://', 'https://', $url);
		$plugins[] = '-' . $name;
		$ext_plugins .= 'tinymce.PluginManager.load("' . $name . '", "' . $url . '");' . "\n";
	}
}
$plugins = implode($plugins, ',');

$mce_buttons = apply_filters('mce_buttons', array('bold', 'italic', 'strikethrough', '|', 'bullist', 'numlist', 'blockquote', '|', 'justifyleft', 'justifycenter', 'justifyright', '|', 'link', 'unlink', 'image', 'wp_more', '|', 'spellchecker', 'fullscreen', 'wp_adv' ));
$mce_buttons = implode($mce_buttons, ',');

$mce_buttons_2 = apply_filters('mce_buttons_2', array('formatselect', 'underline', 'justifyfull', 'forecolor', '|', 'pastetext', 'pasteword', 'removeformat', '|', 'media', 'charmap', '|', 'outdent', 'indent', '|', 'undo', 'redo', 'wp_help' ));
$mce_buttons_2 = implode($mce_buttons_2, ',');

$mce_buttons_3 = apply_filters('mce_buttons_3', array());
$mce_buttons_3 = implode($mce_buttons_3, ',');
	
$mce_buttons_4 = apply_filters('mce_buttons_4', array());
$mce_buttons_4 = implode($mce_buttons_4, ',');

$mce_locale = ( '' == get_locale() ) ? 'en' : strtolower( substr(get_locale(), 0, 2) ); // only ISO 639-1

// TinyMCE init settings
$initArray = array (
	'mode' => 'none',
	'onpageload' => 'wpEditorInit',
    'width' => '100%',
	'theme' => 'advanced',
	'skin' => 'wp_theme',
	'theme_advanced_buttons1' => "$mce_buttons",
	'theme_advanced_buttons2' => "$mce_buttons_2",
	'theme_advanced_buttons3' => "$mce_buttons_3",
	'theme_advanced_buttons4' => "$mce_buttons_4",
	'language' => "$mce_locale",
	'spellchecker_languages' => "$mce_spellchecker_languages",
	'theme_advanced_toolbar_location' => 'top',
	'theme_advanced_toolbar_align' => 'left',
	'theme_advanced_statusbar_location' => 'bottom',
	'theme_advanced_resizing' => true,
	'theme_advanced_resize_horizontal' => false,
	'dialog_type' => 'modal',
	'relative_urls' => false,
	'remove_script_host' => false,
	'gecko_spellcheck' => true,
	'entities' => '38,amp,60,lt,62,gt',
	'accessibility_focus' => false,
	'tab_focus' => ':next',
	'content_css' => "$mce_css",
	'save_callback' => 'switchEditors.saveCallback',
	'plugins' => "$plugins",
	// pass-through the settings for compression and caching, so they can be changed with "tiny_mce_before_init"
	'disk_cache' => true,
	'compress' => true,
	'old_cache_max' => '1' // number of cache files to keep
);

if ( $valid_elements ) $initArray['valid_elements'] = $valid_elements;
if ( $extended_valid_elements ) $initArray['extended_valid_elements'] = $extended_valid_elements;
if ( $invalid_elements ) $initArray['invalid_elements'] = $invalid_elements;

// For people who really REALLY know what they're doing with TinyMCE
// You can modify initArray to add, remove, change elements of the config before tinyMCE.init
$initArray = apply_filters('tiny_mce_before_init', $initArray); // changed from action to filter

// support for deprecated actions
ob_start();
do_action('mce_options');
$mce_deprecated1 = ob_get_contents() || '';
ob_end_clean();

// Settings for the gzip compression and cache
$disk_cache = ( ! isset($initArray['disk_cache']) || false == $initArray['disk_cache'] ) ? false : true;
$compress = ( ! isset($initArray['compress']) || false == $initArray['compress'] ) ? false : true;
$old_cache_max = ( isset($initArray['old_cache_max']) ) ? (int) $initArray['old_cache_max'] : 0;

$initArray['disk_cache'] = $initArray['compress'] = $initArray['old_cache_max'] = null;
unset( $initArray['disk_cache'], $initArray['compress'], $initArray['old_cache_max'] );

// Anybody still using IE5/5.5? It can't handle gzip compressed js well.
if ( $msie = strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') ) {
	$ie_ver = (int) substr( $_SERVER['HTTP_USER_AGENT'] , $msie + 5, 3 );
	if ( $ie_ver && $ie_ver < 6 ) $compress = false;
}

// Cache path, this is where the .gz files will be stored
$cache_path = ABSPATH . 'wp-content/uploads/js_cache'; 
if ( $disk_cache && ! is_dir($cache_path) )
	$disk_cache = wp_mkdir_p($cache_path);

$cache_ext = '.js';

$plugins = explode( ',', $initArray['plugins'] );
$theme = ( 'simple' == $initArray['theme'] ) ? 'simple' : 'advanced';
$language = isset($initArray['language']) ? substr( $initArray['language'], 0, 2 ) : 'en';
$enc = $cacheKey = $suffix = $mce_options = '';	

// Check if browser supports gzip
if ( $compress && isset($_SERVER['HTTP_ACCEPT_ENCODING']) ) {
	$encodings = explode( ',', strtolower( preg_replace('/\s+/', '', $_SERVER['HTTP_ACCEPT_ENCODING']) ) );

	if ( (in_array('gzip', $encodings) || in_array('x-gzip', $encodings) || isset($_SERVER['---------------']) ) && function_exists('ob_gzhandler') && (ini_get('zlib.output_compression') == false) ) {
		$enc = in_array('x-gzip', $encodings) ? 'x-gzip' : 'gzip';
		$cache_ext = '.gz';
	}
}

// Setup cache info
if ( $disk_cache ) {

	$ver = isset($_GET['ver']) ? (int) $_GET['ver'] : '';
	$cacheKey = $suffix . $ver;

	foreach ( $initArray as $v )
		$cacheKey .= $v;

	$cacheKey = md5( $cacheKey );
	$cache_file = $cache_path . '/tinymce_' . $cacheKey . $cache_ext;
}

cache_javascript_headers();

// Use cached file if exists
if ( $disk_cache && file_exists($cache_file) ) {
	if ( '.gz' == $cache_ext )
		header( 'Content-Encoding: ' . $enc );

	echo getFileContents( $cache_file );
	exit;
}

foreach ( $initArray as $k => $v ) 
    $mce_options .= $k . ':"' . $v . '",';

$mce_options .= $mce_deprecated1;
$mce_options = rtrim( trim($mce_options), '\n\r,' );

$content .= 'var tinyMCEPreInit = { settings : { themes : "' . $theme . '", plugins : "' . $initArray['plugins'] . '", languages : "' . $language . '", debug : false }, base : "' . $baseurl . '", suffix : "' . $suffix . '" };';

// Load patch
$content .= getFileContents( 'tiny_mce_ext.js' );

// Add core
$content .= getFileContents( 'tiny_mce' . $suffix . '.js' );

// Patch loading functions
$content .= 'tinyMCEPreInit.start();';

// Add all languages (WP)
include_once( dirname(__FILE__).'/langs/wp-langs.php' );
$content .= $strings;

// Add themes
$content .= getFileContents( 'themes/' . $theme . '/editor_template' . $suffix . '.js' );

// Add plugins
foreach ( $plugins as $plugin ) 
	$content .= getFileContents( 'plugins/' . $plugin . '/editor_plugin' . $suffix . '.js' );

// Add external plugins and init 
$content .= $ext_plugins . 'tinyMCE.init({' . $mce_options . '});';

// Generate GZIP'd content
if ( '.gz' == $cache_ext ) {
	header('Content-Encoding: ' . $enc);
	$content = gzencode( $content, 9, FORCE_GZIP );
}

// Stream to client
echo $content;

// Write file
if ( '' != $cacheKey ) {
	if ( is_dir($cache_path) ) {		

		$old_cache = array();
		$handle = opendir($cache_path);
		while ( false !== ( $file = readdir($handle) ) ) {
			if ( $file == '.' || $file == '..' ) continue;
            $saved = filectime("$cache_path/$file");
			if ( strpos($file, 'tinymce_') !== false && substr($file, -3) == $cache_ext ) $old_cache["$saved"] = $file;
		}
		closedir($handle);
			
		krsort($old_cache);
		if ( 1 >= (int) $old_cache_max ) $del_cache = $old_cache;
		else $del_cache = array_slice( $old_cache, ($old_cache_max - 1) );
			
		foreach ( $del_cache as $key )
			@unlink("$cache_path/$key");
	}

	putFileContents( $cache_file, $content );
}
?>
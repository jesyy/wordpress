<?php

//
// Category
//

function category_exists($cat_name) {
	return is_term($cat_name, 'category');
}

function get_category_to_edit( $id ) {
	$category = get_category( $id );

	$category->term_id = (int) $category->term_id;
	$category->parent = (int) $category->parent;

	return $category;
}

function wp_create_category($cat_name) {
	if ( $id = category_exists($cat_name) )
		return $id;

	return wp_insert_category( array('cat_name' => $cat_name) );
}

function wp_create_categories($categories, $post_id = '') {
	$cat_ids = array ();
	foreach ($categories as $category) {
		if ($id = category_exists($category))
			$cat_ids[] = $id;
		else
			if ($id = wp_create_category($category))
				$cat_ids[] = $id;
	}

	if ($post_id)
		wp_set_post_categories($post_id, $cat_ids);

	return $cat_ids;
}

function wp_delete_category($cat_ID) {
	global $wpdb;

	$cat_ID = (int) $cat_ID;
	$default = get_option('default_category');

	// Don't delete the default cat
	if ( $cat_ID == $default )
		return 0;

	return wp_delete_term($cat_ID, 'category', "default=$default");
}

function wp_insert_category($catarr) {
	global $wpdb;

	extract($catarr);

	if ( trim( $cat_name ) == '' )
		return 0;

	$cat_ID = (int) $cat_ID;

	// Are we updating or creating?
	if ( !empty ($cat_ID) )
		$update = true;
	else
		$update = false;

	$name = $cat_name;
	$description = $category_description;
	$slug = $category_nicename;
	$parent = $category_parent;

	$name = apply_filters('pre_category_name', $name);

	if ( empty ($slug) )
		$slug = sanitize_title($slug);
	else
		$slug = sanitize_title($slug);
	$slug = apply_filters('pre_category_nicename', $slug);

	if ( empty ($description) )
		$description = '';
	$description = apply_filters('pre_category_description', $description);

	$parent = (int) $parent;
	if ( empty($parent) || !get_category( $parent ) || ($cat_ID && cat_is_ancestor_of($cat_ID, $parent) ) )
		$parent = 0;

	$args = compact('slug', 'parent', 'description');

	if ( $update )
		$cat_ID = wp_update_term($cat_ID, 'category', $args);
	else
		$cat_ID = wp_insert_term($cat_name, 'category', $args);

	return $cat_ID['term_id'];
}

function wp_update_category($catarr) {
	global $wpdb;

	$cat_ID = (int) $catarr['cat_ID'];

	if( $cat_ID == $catarr['category_parent'] )
		return false;

	// First, get all of the original fields
	$category = get_category($cat_ID, ARRAY_A);

	// Escape data pulled from DB.
	$category = add_magic_quotes($category);

	// Merge old and new fields with new fields overwriting old ones.
	$catarr = array_merge($category, $catarr);

	return wp_insert_category($catarr);
}

//
// Tags
//

function get_tags_to_edit( $post_id ) {
	global $wpdb;

	$post_id = (int) $post_id;
	if ( !$post_id )
		return false;

	$tags = wp_get_post_tags($post_id);

	if ( !$tags )
		return false;

	foreach ( $tags as $tag )
		$tag_names[] = $tag->name;
	$tags_to_edit = join( ', ', $tag_names );
	$tags_to_edit = attribute_escape( $tags_to_edit );
	$tags_to_edit = apply_filters( 'tags_to_edit', $tags_to_edit );
	return $tags_to_edit;
}

function tag_exists($tag_name) {
	return is_term($tag_name, 'post_tag');
}

function wp_create_tag($tag_name) {
	if ( $id = tag_exists($tag_name) )
		return $id;

	return wp_insert_term($tag_name, 'post_tag');	
}

?>
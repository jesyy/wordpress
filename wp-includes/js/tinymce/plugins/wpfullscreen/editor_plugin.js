(function(){tinymce.create("tinymce.plugins.wpFullscreenPlugin",{init:function(b,d){var e=this,h=0,f={},g=tinymce.DOM,a=false;b.addCommand("wpFullScreenClose",function(){if(b.getParam("wp_fullscreen_is_enabled")){g.win.setTimeout(function(){tinyMCE.remove(b);g.remove("wp_mce_fullscreen_parent");tinyMCE.settings=tinyMCE.oldSettings},10)}});b.addCommand("wpFullScreenSave",function(){var i=tinyMCE.get("wp_mce_fullscreen"),j;i.focus();j=tinyMCE.get(i.getParam("wp_fullscreen_editor_id"));j.setContent(i.getContent({format:"raw"}),{format:"raw"})});b.addCommand("wpFullScreenInit",function(){var k=b.getDoc(),i=k.body,j;if(b.id=="wp_mce_fullscreen"){return}tinyMCE.oldSettings=tinyMCE.settings;tinymce.each(b.settings,function(l,m){f[m]=l});f.id="wp_mce_fullscreen";f.wp_fullscreen_is_enabled=true;f.wp_fullscreen_editor_id=b.id;f.theme_advanced_resizing=false;f.theme_advanced_statusbar_location="none";f.content_css=f.content_css?f.content_css+","+f.wp_fullscreen_content_css:f.wp_fullscreen_content_css;f.height=tinymce.isIE?i.scrollHeight:i.offsetHeight;tinymce.each(b.getParam("wp_fullscreen_settings"),function(m,l){f[l]=m});j=new tinymce.Editor("wp_mce_fullscreen",f);j.onInit.add(function(l){var n=tinymce.DOM,m=n.select("a.mceButton",n.get("wp-fullscreen-buttons"));if(!b.isHidden()){l.setContent(b.getContent())}else{l.setContent(switchEditors.wpautop(l.getElement().value))}setTimeout(function(){l.onNodeChange.add(function(p,o,q){tinymce.each(m,function(t){var s,r;if(s=n.get("wp_mce_fullscreen_"+t.id.substr(6))){r=s.className;if(r){t.className=r}}})})},1000);l.dom.addClass(l.getBody(),"wp-fullscreen-editor");l.focus()});j.render();if("undefined"!=fullscreen){j.dom.bind(j.dom.doc,"mousemove",function(l){fullscreen.bounder("showToolbar","hideToolbar",2000)})}});if("undefined"!=fullscreen){b.addButton("fullscreen",{title:"fullscreen.desc",onclick:function(){fullscreen.on()}})}if(b.getParam("fullscreen_is_enabled")||!b.getParam("wp_fullscreen_is_enabled")){return}function c(){if(a){return}var k=b.getDoc(),j=tinymce.DOM,l,i;if(tinymce.isIE){i=k.body.scrollHeight}else{if(tinymce.isWebKit){i=k.height}else{i=k.documentElement.offsetHeight}}l=(i>300)?i:300;if(h!=l){h=l;a=true;setTimeout(function(){a=false},100);j.setStyle(j.get(b.id+"_ifr"),"height",l+"px")}}b.onInit.add(function(j,i){j.onChange.add(c);j.onSetContent.add(c);j.onPaste.add(c);j.onKeyUp.add(c);j.onPostRender.add(c);j.getBody().style.overflowY="hidden"});if(b.getParam("autoresize_on_init",true)){b.onLoadContent.add(function(j,i){setTimeout(function(){c()},1200)})}b.addCommand("wpAutoResize",c)},getInfo:function(){return{longname:"WP Fullscreen",author:"WordPress",authorurl:"http://wordpress.org",infourl:"",version:"1.0"}}});tinymce.PluginManager.add("wpfullscreen",tinymce.plugins.wpFullscreenPlugin)})();
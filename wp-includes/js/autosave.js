var autosaveLast="",autosavePeriodical,autosaveOldMessage="",autosaveDelayPreview=false,autosaveFirst=true;jQuery(function(a){autosaveLast=a("#post #title").val()+a("#post #content").val();autosavePeriodical=a.schedule({time:autosaveL10n.autosaveInterval*1000,func:function(){autosave()},repeat:true,protect:true});a("#post").submit(function(){a.cancel(autosavePeriodical)})});function autosave_parse_response(b){var c=wpAjax.parseAjaxResponse(b,"autosave"),d="",a;if(c&&c.responses&&c.responses.length){d=c.responses[0].data;if(c.responses[0].supplemental){if("disable"==c.responses[0].supplemental.disable_autosave){autosave=function(){};c={errors:true}}jQuery.each(c.responses[0].supplemental,function(e,f){if(e.match(/^replace-/)){jQuery("#"+e.replace("replace-","")).val(f)}})}if(!c.errors){a=parseInt(c.responses[0].id,10);if(!isNaN(a)&&a>0){autosave_update_slug(a)}}}if(d){jQuery("#autosave").html(d)}else{if(autosaveOldMessage&&c){jQuery("#autosave").html(autosaveOldMessage)}}return c}function autosave_saved(a){autosave_parse_response(a);autosave_enable_buttons()}function autosave_saved_new(b){var d=autosave_parse_response(b),c,a;if(d&&d.responses.length&&!d.errors){c=jQuery("#post_ID").val();a=parseInt(d.responses[0].id,10);autosave_update_post_ID(a);if(c<0&&a>0){jQuery("#media-buttons a").each(function(){this.href=this.href.replace(c,a)})}autosaveFirst=false;if(autosaveDelayPreview){jQuery("#post-preview").click()}}else{autosave_enable_buttons()}}function autosave_update_post_ID(a){if(!isNaN(a)&&a>0){if(a==parseInt(jQuery("#post_ID").val(),10)){return}jQuery("#post_ID").attr({name:"post_ID"});jQuery("#post_ID").val(a);jQuery.post(autosaveL10n.requestFile,{action:"autosave-generate-nonces",post_ID:a,autosavenonce:jQuery("#autosavenonce").val(),post_type:jQuery("#post_type").val()},function(b){jQuery("#_wpnonce").val(b);autosave_enable_buttons()});jQuery("#hiddenaction").val("editpost")}}function autosave_update_slug(a){if(jQuery.isFunction(make_slugedit_clickable)&&!jQuery("#edit-slug-box > *").size()){jQuery.post(slugL10n.requestFile,{action:"sample-permalink",post_id:a,new_title:jQuery("#title").val(),samplepermalinknonce:jQuery("#samplepermalinknonce").val()},function(b){jQuery("#edit-slug-box").html(b);make_slugedit_clickable()})}}function autosave_loading(){jQuery("#autosave").html(autosaveL10n.savingText)}function autosave_enable_buttons(){jQuery(".submitbox :button:disabled, .submitbox :submit:disabled").attr("disabled","")}function autosave_disable_buttons(){jQuery(".submitbox :button:enabled, .submitbox :submit:enabled").attr("disabled","disabled");setTimeout(autosave_enable_buttons,5000)}var autosave=function(){var c=(typeof tinyMCE!="undefined")&&tinyMCE.activeEditor&&!tinyMCE.activeEditor.isHidden(),d,f,b,e,a;d={action:"autosave",post_ID:jQuery("#post_ID").val()||0,post_title:jQuery("#title").val()||"",autosavenonce:jQuery("#autosavenonce").val(),post_type:jQuery("#post_type").val()||"",autosave:1};jQuery(".tags-input").each(function(){d[this.name]=this.value});f=true;if(jQuery("#TB_window").css("display")=="block"){f=false}if(c){b=tinyMCE.activeEditor;if("mce_fullscreen"==b.id){tinyMCE.get("content").setContent(b.getContent({format:"raw"}),{format:"raw"})}tinyMCE.get("content").save()}d.content=jQuery("#content").val();if(jQuery("#post_name").val()){d.post_name=jQuery("#post_name").val()}if((d.post_title.length==0&&d.content.length==0)||d.post_title+d.content==autosaveLast){f=false}autosave_disable_buttons();e=jQuery("#original_post_status").val();autosaveLast=jQuery("#title").val()+jQuery("#content").val();goodcats=([]);jQuery("[@name='post_category[]']:checked").each(function(g){goodcats.push(this.value)});d.catslist=goodcats.join(",");if(jQuery("#comment_status").attr("checked")){d.comment_status="open"}if(jQuery("#ping_status").attr("checked")){d.ping_status="open"}if(jQuery("#excerpt").size()){d.excerpt=jQuery("#excerpt").val()}if(jQuery("#post_author").size()){d.post_author=jQuery("#post_author").val()}d.user_ID=jQuery("#user-id").val();if(c&&tinyMCE.activeEditor.plugins.spellchecker&&tinyMCE.activeEditor.plugins.spellchecker.active){f=false}if(parseInt(d.post_ID,10)<1){d.temp_ID=d.post_ID;a=autosave_saved_new}else{a=autosave_saved}if(!f){d.autosave=0}autosaveOldMessage=jQuery("#autosave").html();jQuery.ajax({data:d,beforeSend:f?autosave_loading:null,type:"POST",url:autosaveL10n.requestFile,success:a})};
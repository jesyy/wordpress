var topWin=window.dialogArguments||opener||parent||top,uploader,uploader_init;function fileDialogStart(){jQuery("#media-upload-error").empty()}function fileQueued(b){jQuery(".media-blank").remove();var a=jQuery("#media-items").children(),c=post_id||0;if(a.length==1){a.removeClass("open").find(".slidetoggle").slideUp(200)}jQuery("#media-items").append('<div id="media-item-'+b.id+'" class="media-item child-of-'+c+'"><div class="progress"><div class="percent">0%</div><div class="bar"></div></div><div class="filename original"> '+b.name+"</div></div>");jQuery("#insert-gallery").prop("disabled",true)}function uploadStart(){try{if(typeof topWin.tb_remove!="undefined"){topWin.jQuery("#TB_overlay").unbind("click",topWin.tb_remove)}}catch(a){}return true}function uploadProgress(a,b){var c=jQuery("#media-item-"+b.id);jQuery(".bar",c).width((200*b.loaded)/b.size);jQuery(".percent",c).html(b.percent+"%")}function fileUploading(c,d){var b=100*1024*1024,a=parseInt(c.settings.max_file_size,10);if(a>b&&d.size>b){setTimeout(function(){var e;if(d.status<3&&d.loaded==0){wpFileError(d,pluploadL10n.big_upload_failed.replace("%1$s",'<a class="uploader-html" href="#">').replace("%2$s","</a>"));c.stop();c.removeFile(d);c.start()}},10000)}}function updateMediaForm(){var a=jQuery("#media-items").children();if(a.length==1){a.addClass("open").find(".slidetoggle").show();jQuery(".insert-gallery").hide()}else{if(a.length>1){a.removeClass("open");jQuery(".insert-gallery").show()}}if(a.not(".media-blank").length>0){jQuery(".savebutton").show()}else{jQuery(".savebutton").hide()}}function uploadSuccess(c,a){var b=jQuery("#media-item-"+c.id);a=a.replace(/^<pre>(\d+)<\/pre>$/,"$1");if(a.match("media-upload-error")){b.html(a);return}else{jQuery(".percent",b).html(pluploadL10n.crunching)}prepareMediaItem(c,a);updateMediaForm();if(post_id&&b.hasClass("child-of-"+post_id)){jQuery("#attachments-count").text(1*jQuery("#attachments-count").text()+1)}}function setResize(a){if(a){if(uploader.features.jpgresize){uploader.settings.resize={width:resize_width,height:resize_height,quality:100}}else{uploader.settings.multipart_params.image_resize=true}}else{delete (uploader.settings.resize);delete (uploader.settings.multipart_params.image_resize)}}function prepareMediaItem(c,a){var d=(typeof shortform=="undefined")?1:2,b=jQuery("#media-item-"+c.id);try{if(typeof topWin.tb_remove!="undefined"){topWin.jQuery("#TB_overlay").click(topWin.tb_remove)}}catch(g){}if(isNaN(a)||!a){b.append(a);prepareMediaItemInit(c)}else{b.load("async-upload.php",{attachment_id:a,fetch:d},function(){prepareMediaItemInit(c);updateMediaForm()})}}function prepareMediaItemInit(b){var a=jQuery("#media-item-"+b.id);jQuery(".thumbnail",a).clone().attr("class","pinkynail toggle").prependTo(a);jQuery(".filename.original",a).replaceWith(jQuery(".filename.new",a));jQuery("a.delete",a).click(function(){jQuery.ajax({url:ajaxurl,type:"post",success:deleteSuccess,error:deleteError,id:b.id,data:{id:this.id.replace(/[^0-9]/g,""),action:"trash-post",_ajax_nonce:this.href.replace(/^.*wpnonce=/,"")}});return false});jQuery("a.undo",a).click(function(){jQuery.ajax({url:ajaxurl,type:"post",id:b.id,data:{id:this.id.replace(/[^0-9]/g,""),action:"untrash-post",_ajax_nonce:this.href.replace(/^.*wpnonce=/,"")},success:function(d,e){var c=jQuery("#media-item-"+b.id);if(type=jQuery("#type-of-"+b.id).val()){jQuery("#"+type+"-counter").text(jQuery("#"+type+"-counter").text()-0+1)}if(post_id&&c.hasClass("child-of-"+post_id)){jQuery("#attachments-count").text(jQuery("#attachments-count").text()-0+1)}jQuery(".filename .trashnotice",c).remove();jQuery(".filename .title",c).css("font-weight","normal");jQuery("a.undo",c).addClass("hidden");jQuery(".menu_order_input",c).show();c.css({backgroundColor:"#ceb"}).animate({backgroundColor:"#fff"},{queue:false,duration:500,complete:function(){jQuery(this).css({backgroundColor:""})}}).removeClass("undo")}});return false});jQuery("#media-item-"+b.id+".startopen").removeClass("startopen").addClass("open").find("slidetoggle").fadeIn()}function wpQueueError(a){jQuery("#media-upload-error").show().html('<div class="error"><p>'+a+"</p></div>")}function wpFileError(b,a){itemAjaxError(b.id,a)}function itemAjaxError(e,c){var b=jQuery("#media-item-"+e),a=b.find(".filename").text(),d=b.data("last-err");if(d==e){return}b.html('<div class="error-div"><a class="dismiss" href="#">'+pluploadL10n.dismiss+"</a><strong>"+pluploadL10n.error_uploading.replace("%s",jQuery.trim(a))+"</strong> "+c+"</div>").data("last-err",e)}function deleteSuccess(b,d){if(b=="-1"){return itemAjaxError(this.id,"You do not have permission. Has your session expired?")}if(b=="0"){return itemAjaxError(this.id,"Could not be deleted. Has it been deleted already?")}var c=this.id,a=jQuery("#media-item-"+c);if(type=jQuery("#type-of-"+c).val()){jQuery("#"+type+"-counter").text(jQuery("#"+type+"-counter").text()-1)}if(post_id&&a.hasClass("child-of-"+post_id)){jQuery("#attachments-count").text(jQuery("#attachments-count").text()-1)}if(jQuery("form.type-form #media-items").children().length==1&&jQuery(".hidden","#media-items").length>0){jQuery(".toggle").toggle();jQuery(".slidetoggle").slideUp(200).siblings().removeClass("hidden")}jQuery(".toggle",a).toggle();jQuery(".slidetoggle",a).slideUp(200).siblings().removeClass("hidden");a.css({backgroundColor:"#faa"}).animate({backgroundColor:"#f4f4f4"},{queue:false,duration:500}).addClass("undo");jQuery(".filename:empty",a).remove();jQuery(".filename .title",a).css("font-weight","bold");jQuery(".filename",a).append('<span class="trashnotice"> '+pluploadL10n.deleted+" </span>").siblings("a.toggle").hide();jQuery(".filename",a).append(jQuery("a.undo",a).removeClass("hidden"));jQuery(".menu_order_input",a).hide();return}function deleteError(c,b,a){}function uploadComplete(){jQuery("#insert-gallery").prop("disabled",false)}function switchUploader(a){if(a){deleteUserSetting("uploader");jQuery(".media-upload-form").removeClass("html-uploader");if(typeof(uploader)=="object"){uploader.refresh()}}else{setUserSetting("uploader","1");jQuery(".media-upload-form").addClass("html-uploader")}}function dndHelper(a){var b=document.getElementById("dnd-helper");if(a){b.style.display="block"}else{b.style.display="none"}}function uploadError(d,f,c,e){var b=100*1024*1024,a;switch(f){case plupload.FAILED:wpFileError(d,pluploadL10n.upload_failed);break;case plupload.FILE_EXTENSION_ERROR:wpFileError(d,pluploadL10n.invalid_filetype);break;case plupload.FILE_SIZE_ERROR:uploadSizeError(e,d);break;case plupload.IMAGE_FORMAT_ERROR:wpFileError(d,pluploadL10n.not_an_image);break;case plupload.IMAGE_MEMORY_ERROR:wpFileError(d,pluploadL10n.image_memory_exceeded);break;case plupload.IMAGE_DIMENSIONS_ERROR:wpFileError(d,pluploadL10n.image_dimensions_exceeded);break;case plupload.GENERIC_ERROR:wpQueueError(pluploadL10n.upload_failed);break;case plupload.IO_ERROR:a=parseInt(e.settings.max_file_size,10);if(a>b&&d.size>b){wpFileError(d,pluploadL10n.big_upload_failed.replace("%1$s",'<a class="uploader-html" href="#">').replace("%2$s","</a>"))}else{wpQueueError(pluploadL10n.io_error)}break;case plupload.HTTP_ERROR:wpQueueError(pluploadL10n.http_error);break;case plupload.INIT_ERROR:jQuery(".media-upload-form").addClass("html-uploader");break;case plupload.SECURITY_ERROR:wpQueueError(pluploadL10n.security_error);break;default:wpFileError(d,pluploadL10n.default_error)}}function uploadSizeError(a,b,d){var c;if(d){c=pluploadL10n.big_upload_queued.replace("%s",b.name)+" "+pluploadL10n.big_upload_failed.replace("%1$s",'<a class="uploader-html" href="#">').replace("%2$s","</a>")}else{c=pluploadL10n.file_exceeds_size_limit.replace("%s",b.name)}jQuery("#media-items").append('<div id="media-item-'+b.id+'" class="media-item error"><p>'+c+"</p></div>");a.removeFile(b)}jQuery(document).ready(function(a){a(".media-upload-form").bind("click.uploader",function(f){var d=a(f.target),b,g;if(d.is('input[type="radio"]')){b=d.closest("tr");if(b.hasClass("align")){setUserSetting("align",d.val())}else{if(b.hasClass("image-size")){setUserSetting("imgsize",d.val())}}}else{if(d.is("button.button")){g=f.target.className||"";g=g.match(/url([^ '"]+)/);if(g&&g[1]){setUserSetting("urlbutton",g[1]);d.siblings(".urlfield").val(d.data("link-url"))}}else{if(d.is("a.dismiss")){d.parents(".media-item").fadeOut(200,function(){a(this).remove()})}else{if(d.is(".upload-flash-bypass a")||d.is("a.uploader-html")){a("#media-items, p.submit, span.big-file-warning").css("display","none");switchUploader(0);f.preventDefault()}else{if(d.is(".upload-html-bypass a")){a("#media-items, p.submit, span.big-file-warning").css("display","");switchUploader(1);f.preventDefault()}else{if(d.is("a.describe-toggle-on")){d.parent().addClass("open");d.siblings(".slidetoggle").fadeIn(250,function(){var i=a(window).scrollTop(),e=a(window).height(),k=a(this).offset().top,j=a(this).height(),c,l;if(e&&k&&j){c=k+j;l=i+e;if(c>l){if(c-l<k-i){window.scrollBy(0,(c-l)+10)}else{window.scrollBy(0,k-i-40)}}}});f.preventDefault()}else{if(d.is("a.describe-toggle-off")){d.siblings(".slidetoggle").fadeOut(250,function(){d.parent().removeClass("open")});f.preventDefault()}}}}}}}});uploader_init=function(){uploader=new plupload.Uploader(wpUploaderInit);a("#image_resize").bind("change",function(){var b=a(this).prop("checked");setResize(b);if(b){setUserSetting("upload_resize","1")}else{deleteUserSetting("upload_resize")}});uploader.bind("Init",function(b){var c=a("#plupload-upload-ui");setResize(getUserSetting("upload_resize",false));if(b.features.dragdrop){c.addClass("drag-drop");a("#drag-drop-area").bind("dragover.wp-uploader",function(){c.addClass("drag-over")}).bind("dragleave.wp-uploader, drop.wp-uploader",function(){c.removeClass("drag-over")})}else{c.removeClass("drag-drop");a("#drag-drop-area").unbind(".wp-uploader")}});uploader.init();uploader.bind("FilesAdded",function(d,e){var c=100*1024*1024,b=parseInt(d.settings.max_file_size,10);a("#media-upload-error").html("");uploadStart();plupload.each(e,function(f){if(b>c&&f.size>c&&d.runtime!="html5"){uploadSizeError(d,f,true)}else{fileQueued(f)}});d.refresh();d.start()});uploader.bind("BeforeUpload",function(b,c){});uploader.bind("UploadFile",function(b,c){fileUploading(b,c)});uploader.bind("UploadProgress",function(b,c){uploadProgress(b,c)});uploader.bind("Error",function(b,c){uploadError(c.file,c.code,c.message,b);b.refresh()});uploader.bind("FileUploaded",function(b,d,c){uploadSuccess(d,c.response)});uploader.bind("UploadComplete",function(b,c){uploadComplete()})};if(typeof(wpUploaderInit)=="object"){uploader_init()}});
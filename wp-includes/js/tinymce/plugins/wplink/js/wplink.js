var wpLink;(function(f){var b={},e={},d,a,c;wpLink={timeToTriggerRiver:150,minRiverAJAXDuration:200,riverBottomThreshold:5,keySensitivity:100,lastSearch:"",init:function(){b.dialog=f("#wp-link");b.submit=f("#wp-link-submit");b.url=f("#url-field");b.title=f("#link-title-field");b.openInNewTab=f("#link-target-checkbox");b.search=f("#search-field");e.search=new a(f("#search-results"));e.recent=new a(f("#most-recent-results"));e.elements=f(".query-results",b.dialog);b.dialog.keydown(wpLink.keydown);b.dialog.keyup(wpLink.keyup);b.submit.click(function(g){wpLink.update();g.preventDefault()});f("#wp-link-cancel").click(wpLink.cancel);e.elements.bind("river-select",wpLink.updateFields);b.search.keyup(wpLink.searchInternalLinks);b.dialog.bind("wpdialogrefresh",wpLink.refresh)},refresh:function(){var g;d=tinyMCEPopup.editor;e.search.refresh();e.recent.refresh();tinyMCEPopup.restoreSelection();if(g=d.dom.getParent(d.selection.getNode(),"A")){b.url.val(g.href);b.title.val(d.dom.getAttrib(g,"title"));if("_blank"==d.dom.getAttrib(g,"target")){b.openInNewTab.attr("checked","checked")}b.submit.val(wpLinkL10n.update)}else{wpLink.setDefaultValues();b.submit.val(wpLinkL10n.save)}tinyMCEPopup.storeSelection();b.url.focus()[0].select();if(!e.recent.ul.children().length){e.recent.ajax()}},cancel:function(){tinyMCEPopup.close()},update:function(){var h=tinyMCEPopup.editor,i={href:b.url.val(),title:b.title.val(),target:b.openInNewTab.attr("checked")?"_blank":""},j,g;tinyMCEPopup.restoreSelection();j=h.dom.getParent(h.selection.getNode(),"A");if(!i.href||i.href=="http://"){if(j){tinyMCEPopup.execCommand("mceBeginUndoLevel");g=h.selection.getBookmark();h.dom.remove(j,1);h.selection.moveToBookmark(g);tinyMCEPopup.execCommand("mceEndUndoLevel");tinyMCEPopup.close()}return}tinyMCEPopup.execCommand("mceBeginUndoLevel");if(j==null){h.getDoc().execCommand("unlink",false,null);tinyMCEPopup.execCommand("CreateLink",false,"#mce_temp_url#",{skip_undo:1});tinymce.each(h.dom.select("a"),function(k){if(h.dom.getAttrib(k,"href")=="#mce_temp_url#"){j=k;h.dom.setAttribs(j,i)}});if(f(j).text()=="#mce_temp_url#"){h.dom.remove(j);j=null}}else{h.dom.setAttribs(j,i)}if(j&&(j.childNodes.length!=1||j.firstChild.nodeName!="IMG")){h.focus();h.selection.select(j);h.selection.collapse(0);tinyMCEPopup.storeSelection()}tinyMCEPopup.execCommand("mceEndUndoLevel");tinyMCEPopup.close()},updateFields:function(i,h,g){b.url.val(h.children(".item-permalink").val());b.title.val(h.hasClass("no-title")?"":h.children(".item-title").text());if(g&&g.type=="click"){b.url.focus()}},setDefaultValues:function(){b.url.val("http://");b.title.val("")},searchInternalLinks:function(){var h=f(this),i,g=h.val();if(g.length>2){e.recent.hide();e.search.show();if(wpLink.lastSearch==g){return}wpLink.lastSearch=g;i=h.siblings("img.waiting").show();e.search.change(g);e.search.ajax(function(){i.hide()})}else{e.search.hide();e.recent.show()}},next:function(){e.search.next();e.recent.next()},prev:function(){e.search.prev();e.recent.prev()},keydown:function(i){var h,g=f.ui.keyCode;switch(i.which){case g.UP:h="prev";case g.DOWN:h=h||"next";clearInterval(wpLink.keyInterval);wpLink[h]();wpLink.keyInterval=setInterval(wpLink[h],wpLink.keySensitivity);break;default:return}i.preventDefault()},keyup:function(h){var g=f.ui.keyCode;switch(h.which){case g.ESCAPE:wpLink.cancel();break;case g.UP:case g.DOWN:clearInterval(wpLink.keyInterval);break;default:return}h.preventDefault()},delayedCallback:function(i,g){var l,k,j,h;if(!g){return i}setTimeout(function(){if(k){return i.apply(h,j)}l=true},g);return function(){if(l){return i.apply(this,arguments)}j=arguments;h=this;k=true}}};a=function(i,h){var g=this;this.element=i;this.ul=i.children("ul");this.waiting=i.find(".river-waiting");this.change(h);this.refresh();i.scroll(function(){g.maybeLoad()});i.delegate("li","click",function(j){g.select(f(this),j)})};f.extend(a.prototype,{refresh:function(){this.deselect();this.visible=this.element.is(":visible")},show:function(){if(!this.visible){this.deselect();this.element.show();this.visible=true}},hide:function(){this.element.hide();this.visible=false},select:function(h,k){var j,i,l,g;if(h.hasClass("unselectable")||h==this.selected){return}this.deselect();this.selected=h.addClass("selected");j=h.outerHeight();i=this.element.height();l=h.position().top;g=this.element.scrollTop();if(l<0){this.element.scrollTop(g+l)}else{if(l+j>i){this.element.scrollTop(g+l-i+j)}}this.element.trigger("river-select",[h,k,this])},deselect:function(){if(this.selected){this.selected.removeClass("selected")}this.selected=false},prev:function(){if(!this.visible){return}var g;if(this.selected){g=this.selected.prev("li");if(g.length){this.select(g)}}},next:function(){if(!this.visible){return}var g=this.selected?this.selected.next("li"):f("li:not(.unselectable):first",this.element);if(g.length){this.select(g)}},ajax:function(j){var h=this,i=this.query.page==1?0:wpLink.minRiverAJAXDuration,g=wpLink.delayedCallback(function(k,l){h.process(k,l);if(j){j(k,l)}},i);this.query.ajax(g)},change:function(g){if(this.query&&this._search==g){return}this._search=g;this.query=new c(g);this.element.scrollTop(0)},process:function(h,l){var i="",j=true,g="",k=l.page==1;if(!h){if(k){i+='<li class="unselectable"><span class="item-title"><em>'+wpLinkL10n.noMatchesFound+"</em></span></li>"}}else{f.each(h,function(){g=j?"alternate":"";g+=this["title"]?"":" no-title";i+=g?'<li class="'+g+'">':"<li>";i+='<input type="hidden" class="item-permalink" value="'+this["permalink"]+'" />';i+='<span class="item-title">';i+=this["title"]?this["title"]:wpLinkL10n.noTitle;i+='</span><span class="item-info">'+this["info"]+"</span></li>";j=!j})}this.ul[k?"html":"append"](i)},maybeLoad:function(){var h=this,i=this.element,g=i.scrollTop()+i.height();if(!this.query.ready()||g<this.ul.height()-wpLink.riverBottomThreshold){return}setTimeout(function(){var j=i.scrollTop(),k=j+i.height();if(!h.query.ready()||k<h.ul.height()-wpLink.riverBottomThreshold){return}h.waiting.show();i.scrollTop(j+h.waiting.outerHeight());h.ajax(function(){h.waiting.hide()})},wpLink.timeToTriggerRiver)}});c=function(g){this.page=1;this.allLoaded=false;this.querying=false;this.search=g};f.extend(c.prototype,{ready:function(){return !(this.querying||this.allLoaded)},ajax:function(i){var g=this,h={action:"wp-link-ajax",page:this.page};if(this.search){h.search=this.search}this.querying=true;f.post(ajaxurl,h,function(j){g.page++;g.querying=false;g.allLoaded=!j;i(j,h)},"json")}});f(document).ready(wpLink.init)})(jQuery);
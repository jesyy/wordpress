jQuery(function(e){e(".noscript-action").remove();var a=false;var h=function(){if(a){return}window.onbeforeunload=function(){return widgetsL10n.lamerReminder};e("h2:first").after('<div class="updated"><p>'+widgetsL10n.lameReminder+"</p></div>");e("#current-widgets .submit input[name=save-widgets]").css("background-color","#ffffe0").click(function(){window.onbeforeunload=null});a=true};var j=1;var g=function(k,m){var l=k.find("input.widget-width").val();var n=e.browser.msie?function(){var o=e(this);if(o.is(":visible")){if(m){o.find(":input:enabled").not('[name="widget-id[]"], [name*="[submit]"]').attr("disabled","disabled")}k.css("marginLeft",0);o.siblings("div").children("h4").children("a").text(widgetsL10n.edit)}else{o.find(":disabled").attr("disabled","");if(l>250){k.css("marginLeft",(l-250)*-1)}o.siblings("div").children("h4").children("a").text(widgetsL10n.cancel)}o.toggle()}:function(){var o=e(this);if(o.is(":visible")){if(m){o.find(":input:enabled").not('[name="widget-id[]"], [name*="[submit]"]').attr("disabled","disabled")}if(l>250){k.animate({marginLeft:0})}o.siblings("div").children("h4").children("a").text(widgetsL10n.edit)}else{o.find(":disabled").attr("disabled","");if(l>250){k.animate({marginLeft:(l-250)*-1})}o.siblings("div").children("h4").children("a").text(widgetsL10n.cancel)}o.animate({height:"toggle"})};return k.children("div.widget-control").each(n).end()};var b=function(){var l=wpAjax.unserialize(this.href);if((l.sidebar&&l.sidebar==e("#sidebar").val())||l.add){var k=l.edit||l.add;g(e('#current-sidebar .widget-control-list input[@name^="widget-id"][@value='+k+"]").parents("li:first"),false).blur();return false}else{if(l.sidebar){return true}}g(e(this).parents("li:first"),true).blur();return false};var c=function(){var o=e(this).parents("li:first").find("ul.widget-control-info li");var l=o.clone();if(l.html().match(/%i%/)){var k=e("#generated-time").val()+j.toString();j++;l.html(l.html().replace(/%i%/g,k))}else{e(this).text(widgetsL10n.edit).unbind().click(b);o.html("<textarea>"+o.html()+"</textarea>")}f(l);i.append(l).SortableAddItem(l[0]);var m=parseInt(e("#widget-count").text(),10)+1;e("#widget-count").text(m.toString());h();return false};var f=function(k){if(!k){k=document}e("a.widget-control-edit",k).click(b);e("a.widget-control-save",k).click(function(){h();g(e(this).parents("li:first"),false).blur();return false});e("a.widget-control-remove",k).click(function(){var l=e(this).parents("li:first").find('input[@name^="widget-id"]').val();e(this).parents("li:first").remove();var m=e("#widget-list ul#widget-control-info-"+l+" textarea");m.parent().html(m.text()).parents("li.widget-list-item:first").children("h4").children("a.widget-action").show().text(widgetsL10n.add).unbind().click(c);var o=parseInt(e("#widget-count").text(),10)-1;e("#widget-count").text(o.toString());return false})};f();e("a.widget-control-add").click(c);var i;var d=function(){try{e("#current-sidebar .widget-control-list").SortableDestroy()}catch(k){}i=e("#current-sidebar .widget-control-list").Sortable({accept:"widget-sortable",helperclass:"sorthelper",handle:"h4.widget-title",onStop:d})};d()});
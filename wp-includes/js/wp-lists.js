(function(b){var a={add:"ajaxAdd",del:"ajaxDel",dim:"ajaxDim",process:"process",recolor:"recolor"},c;c={settings:{url:wpListL10n.url,type:"POST",response:"ajax-response",what:"",alt:"alternate",altOffset:0,addColor:null,delColor:null,dimAddColor:null,dimDelColor:null,confirm:null,addBefore:null,addAfter:null,delBefore:null,delAfter:null,dimBefore:null,dimAfter:null},nonce:function(g,f){var d=wpAjax.unserialize(g.attr("href"));return f.nonce||d._ajax_nonce||b("#"+f.element+" input[name=_ajax_nonce]").val()||d._wpnonce||b("#"+f.element+" input[name=_wpnonce]").val()||0},parseClass:function(h,f){var i=[],d;try{d=b(h).attr("class")||"";d=d.match(new RegExp(f+":[\\S]+"));if(d){i=d[0].split(":")}}catch(g){}return i},pre:function(i,g,d){var f,h;g=b.extend({},this.wpList.settings,{element:null,nonce:0,target:i.get(0)},g||{});if(b.isFunction(g.confirm)){if("add"!=d){f=b("#"+g.element).css("backgroundColor");b("#"+g.element).css("backgroundColor","#FF9966")}h=g.confirm.call(this,i,g,d,f);if("add"!=d){b("#"+g.element).css("backgroundColor",f)}if(!h){return false}}return g},ajaxAdd:function(j,f){j=b(j);f=f||{};var h=this,d=c.parseClass(j,"add"),k,g,i;f=c.pre.call(h,j,f,"add");f.element=d[2]||j.attr("id")||f.element||null;if(d[3]){f.addColor="#"+d[3]}else{f.addColor=f.addColor||"#FFFF33"}if(!f){return false}if(!j.is("[class^=add:"+h.id+":]")){return !c.add.call(h,j,f)}if(!f.element){return true}f.action="add-"+f.what;f.nonce=c.nonce(j,f);k=b("#"+f.element+" :input").not("[name=_ajax_nonce], [name=_wpnonce], [name=action]");g=wpAjax.validateForm("#"+f.element);if(!g){return false}f.data=b.param(b.extend({_ajax_nonce:f.nonce,action:f.action},wpAjax.unserialize(d[4]||"")));i=b.isFunction(k.fieldSerialize)?k.fieldSerialize():k.serialize();if(i){f.data+="&"+i}if(b.isFunction(f.addBefore)){f=f.addBefore(f);if(!f){return true}}if(!f.data.match(/_ajax_nonce=[a-f0-9]+/)){return true}f.success=function(l){var e=wpAjax.parseAjaxResponse(l,f.response,f.element),m;if(!e||e.errors){return false}if(true===e){return true}jQuery.each(e.responses,function(){c.add.call(h,this.data,b.extend({},f,{pos:this.position||0,id:this.id||0,oldId:this.oldId||null}))});if(b.isFunction(f.addAfter)){m=this.complete;this.complete=function(n,o){var p=b.extend({xml:n,status:o,parsed:e},f);f.addAfter(l,p);if(b.isFunction(m)){m(n,o)}}}h.wpList.recolor();c.clear.call(h,"#"+f.element)};b.ajax(f);return false},ajaxDel:function(j,g){j=b(j);g=g||{};var i=this,d=c.parseClass(j,"delete"),f,h;g=c.pre.call(i,j,g,"delete");g.element=d[2]||g.element||null;if(d[3]){g.delColor="#"+d[3]}else{g.delColor=g.delColor||"#FF3333"}if(!g||!g.element){return false}g.action="delete-"+g.what;g.nonce=c.nonce(j,g);g.data=b.extend({action:g.action,id:g.element.split("-").pop(),_ajax_nonce:g.nonce},wpAjax.unserialize(d[4]||""));if(b.isFunction(g.delBefore)){g=g.delBefore(g,i);if(!g){return true}}if(!g.data._ajax_nonce){return true}f=b("#"+g.element);if("none"!=g.delColor){h="slideUp";if(f.css("display").match(/table/)){h="fadeOut"}f.animate({backgroundColor:g.delColor},"fast")[h]("fast").queue(function(){i.wpList.recolor();b(this).dequeue()})}else{i.wpList.recolor()}g.success=function(k){var e=wpAjax.parseAjaxResponse(k,g.response,g.element),l;if(!e||e.errors){f.stop().stop().css("backgroundColor","#FF3333").show().queue(function(){i.wpList.recolor();b(this).dequeue()});return false}if(b.isFunction(g.delAfter)){l=this.complete;this.complete=function(m,n){f.queue(function(){var o=b.extend({xml:m,status:n,parsed:e},g);g.delAfter(k,o);if(b.isFunction(l)){l(m,n)}}).dequeue()}}};b.ajax(g);return false},ajaxDim:function(k,h){if(b(k).parent().css("display")=="none"){return false}k=b(k);h=h||{};var j=this,d=c.parseClass(k,"dim"),g,l,f,i;h=c.pre.call(j,k,h,"dim");h.element=d[2]||h.element||null;h.dimClass=d[3]||h.dimClass||null;if(d[4]){h.dimAddColor="#"+d[4]}else{h.dimAddColor=h.dimAddColor||"#FFFF33"}if(d[5]){h.dimDelColor="#"+d[5]}else{h.dimDelColor=h.dimDelColor||"#FF3333"}if(!h||!h.element||!h.dimClass){return true}h.action="dim-"+h.what;h.nonce=c.nonce(k,h);h.data=b.extend({action:h.action,id:h.element.split("-").pop(),dimClass:h.dimClass,_ajax_nonce:h.nonce},wpAjax.unserialize(d[6]||""));if(b.isFunction(h.dimBefore)){h=h.dimBefore(h);if(!h){return true}}g=b("#"+h.element);l=g.toggleClass(h.dimClass).is("."+h.dimClass);f=c.getColor(g);g.toggleClass(h.dimClass);i=l?h.dimAddColor:h.dimDelColor;if("none"!=i){g.animate({backgroundColor:i},"fast").queue(function(){g.toggleClass(h.dimClass);b(this).dequeue()}).animate({backgroundColor:f},{complete:function(){b(this).css("backgroundColor","")}})}if(!h.data._ajax_nonce){return true}h.success=function(m){var e=wpAjax.parseAjaxResponse(m,h.response,h.element),n;if(!e||e.errors){g.stop().stop().css("backgroundColor","#FF3333")[l?"removeClass":"addClass"](h.dimClass).show().queue(function(){j.wpList.recolor();b(this).dequeue()});return false}if(b.isFunction(h.dimAfter)){n=this.complete;this.complete=function(o,p){g.queue(function(){var q=b.extend({xml:o,status:p,parsed:e},h);h.dimAfter(m,q);if(b.isFunction(n)){n(o,p)}}).dequeue()}}};b.ajax(h);return false},getColor:function(e){if(e.constructor==Object){e=e.get(0)}var f=e,d,g=new RegExp("rgba\\(\\s*0,\\s*0,\\s*0,\\s*0\\s*\\)","i");do{d=jQuery.curCSS(f,"backgroundColor");if(d!=""&&d!="transparent"&&!d.match(g)||jQuery.nodeName(f,"body")){break}}while(f=f.parentNode);return d||"#ffffff"},add:function(k,g){k=b(k);var i=b(this),d=false,j={pos:0,id:0,oldId:null},l,h,f;if("string"==typeof g){g={what:g}}g=b.extend(j,this.wpList.settings,g);if(!k.size()||!g.what){return false}if(g.oldId){d=b("#"+g.what+"-"+g.oldId)}if(g.id&&(g.id!=g.oldId||!d||!d.size())){b("#"+g.what+"-"+g.id).remove()}if(d&&d.size()){d.before(k);d.remove()}else{if(isNaN(g.pos)){l="after";if("-"==g.pos.substr(0,1)){g.pos=g.pos.substr(1);l="before"}h=i.find("#"+g.pos);if(1===h.size()){h[l](k)}else{i.append(k)}}else{if(g.pos<0){i.prepend(k)}else{i.append(k)}}}if(g.alt){if((i.children(":visible").index(k[0])+g.altOffset)%2){k.removeClass(g.alt)}else{k.addClass(g.alt)}}if("none"!=g.addColor){f=c.getColor(k);k.css("backgroundColor",g.addColor).animate({backgroundColor:f},{complete:function(){b(this).css("backgroundColor","")}})}i.each(function(){this.wpList.process(k)});return k},clear:function(h){var g=this,f,d;h=b(h);if(g.wpList&&h.parents("#"+g.id).size()){return}h.find(":input").each(function(){if(b(this).parents(".form-no-clear").size()){return}f=this.type.toLowerCase();d=this.tagName.toLowerCase();if("text"==f||"password"==f||"textarea"==d){this.value=""}else{if("checkbox"==f||"radio"==f){this.checked=false}else{if("select"==d){this.selectedIndex=null}}}})},process:function(d){var e=this;b("[class^=add:"+e.id+":]",d||null).filter("form").submit(function(){return e.wpList.add(this)}).end().not("form").click(function(){return e.wpList.add(this)});b("[class^=delete:"+e.id+":]",d||null).click(function(){return e.wpList.del(this)});b("[class^=dim:"+e.id+":]",d||null).click(function(){return e.wpList.dim(this)})},recolor:function(){var f=this,e,d;if(!f.wpList.settings.alt){return}e=b(".list-item:visible",f);if(!e.size()){e=b(f).children(":visible")}d=[":even",":odd"];if(f.wpList.settings.altOffset%2){d.reverse()}e.filter(d[0]).addClass(f.wpList.settings.alt).end().filter(d[1]).removeClass(f.wpList.settings.alt)},init:function(){var d=this;d.wpList.process=function(e){d.each(function(){this.wpList.process(e)})};d.wpList.recolor=function(){d.each(function(){this.wpList.recolor()})}}};b.fn.wpList=function(d){this.each(function(){var e=this;this.wpList={settings:b.extend({},c.settings,{what:c.parseClass(this,"list")[1]||""},d)};b.each(a,function(g,h){e.wpList[g]=function(i,f){return c[h].call(e,i,f)}})});c.init.call(this);this.wpList.process();return this}})(jQuery);
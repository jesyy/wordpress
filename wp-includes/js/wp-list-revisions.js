(function(a){var b=function(){var d=document.getElementById("post-revisions"),c=d?d.getElementsByTagName("input"):[];d.onclick=function(){var g,f=0,e;for(g=0;g<c.length;g++){f+=c[g].checked?1:0;e=c[g].getAttribute("name");if(!c[g].checked&&("left"==e&&1>f||"right"==e&&1<f&&(!c[g-1]||!c[g-1].checked))&&!(c[g+1]&&c[g+1].checked&&"right"==c[g+1].getAttribute("name"))){c[g].style.visibility="hidden"}else{if("left"==e||"right"==e){c[g].style.visibility="visible"}}}};d.onclick()};if(a&&a.addEventListener){a.addEventListener("load",b,false)}else{if(a&&a.attachEvent){a.attachEvent("onload",b)}}})(window);
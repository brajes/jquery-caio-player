/*!
 * jQuery wrapper for Youtube Video Player
 *
 * @imports SWFObject - http://code.google.com/p/swfobject/
 *
 * Author: Tedi Braja (brajes@c-aio.com)
 * Version: 0.1.1
 */
;(function($) {
  var CaioPlayer = {};
  $.caioplayer = {};
  $.caioplayer.events = {};
  $.caioplayer.ytplayers = {};
  $.caioplayer.defaults = {
    width: "425",
    height: "356",
    params: { allowScriptAccess: "always" },
    stateChange: function(newState) { }
  };
  $.caioplayer.parseYoutubeUrl = function(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
      return match[7];
    }
    else return url;
  }  
  CaioPlayer.iframeScriptInited = false;
  $.fn.caioPlayer = function(options) {
    defaults = { flashvars: {}, params: {}, attributes: { id: "myytplayer" } };
    $.extend(defaults, $.caioplayer.defaults, options);
    return this.each(function() {
      var pid = $(this).attr('id').replace(/-/g,'');
      defaults.attributes.id = pid + jQuery.now();
      defaults.playerID = pid;
      CaioPlayer.init($(this), defaults);
    });
  };
  CaioPlayer.iframeReady = function(o) { };
  CaioPlayer.init = function($player, o){
    CaioPlayer.initFlashPlayer($player, o);
  };
	CaioPlayer.initIframePlayer = function($player, o){
		if(!CaioPlayer.iframeScriptInited){
			var tag = document.createElement('script');
			tag.src = "http://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			CaioPlayer.iframeScriptInited = true;
		};
		window.onYouTubePlayerAPIReady = CaioPlayer.iframeReady(o);
	};
  CaioPlayer.initFlashPlayer = function($player, o){
    if(o.initialVideo){
      var params = o.params;
      var atts = o.attributes;
		  var url =  ["http://www.youtube.com/v/"]
		  url.push( $.caioplayer.parseYoutubeUrl(o.initialVideo) );
		  url.push( "?&enablejsapi=1&version=3" );
		  url.push( "&playerapiid=" + atts.id );
		  url.push( "&fs=" + (o.allowFullScreen?1:0) );
		  if(o.start){ url.push("&start=" + o.start); }
		  if(o.end){ url.push("&end=" + o.end); }
      swfobject.embedSWF(url.join(""), o.playerID, o.width, o.height, "8", null, null, params, atts);
		  window.onYouTubePlayerReady = function(playerId) {
			  var player = document.getElementById(playerId);
        var pid = playerId.replace(/-/g,'');
        var d = $.caioplayer.defaults;
        $.caioplayer.events[pid] = { "stateChange": o.stateChange ? o.stateChange : d.stateChange };
			  player.addEventListener("onStateChange", "$.caioplayer.events."+pid+".stateChange");
			  $.caioplayer.ytplayers[pid] = player;
		  };
		}
	};

})(jQuery);

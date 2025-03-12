
// mark JavaScript support
jQuery('html').removeClass('no-js');

// check touch screen support
if (!(('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))) jQuery('html').addClass('no-touch');

/* callback called when the document is parsed and ready to traverse */
jQuery(document).ready(function () {

	// Fixing the iOS orientation / viewport zoom bug
	if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
		var viewportmeta = document.querySelector('meta[name="viewport"]');
		if (viewportmeta) {
			viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
			document.body.addEventListener('gesturestart', function() {
				viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6'; }, false);
		}
	}

	/* initialize common elements */
	jQuery('.tabs').tabify();
	jQuery(document).on('click','.collapse .collapse-title',function (e) {
		$li = jQuery(this).parent('li');
		$ul = $li.parent('.collapse');
		// check if only one collapse can be opened at a time
		if ($ul.hasClass('only-one-visible')) {
			jQuery('li',$ul).not($li).removeClass('active');
		}
		$li.toggleClass('active');
		e.preventDefault();
	});

	/* menu toggle functionality */
	jQuery('#menu-switch, #menu-toggle').on('click',function(e) {
		jQuery('#search-panel').removeClass('collapse');
		jQuery('#welcome-header, #menu').toggleClass('collapse');
		e.preventDefault();
	});
	if (jQuery('html').hasClass('no-touch')) {
		/* menu toggle functionality - when hovered */
		jQuery('#header #menu, #welcome-header nav').hover(function(e) {
			if (jQuery(window).width() >= 768) {
				jQuery('#menu-switch, #menu-toggle').triggerHandler('click');
			}
		},function(e) {
			if (jQuery(window).width() >= 768) {
				jQuery('#welcome-header, #menu').removeClass('collapse');
			}
		});
	}

	/* search form toggle functionality */
	jQuery('#search-panel #search-toggle').on('click',function(e) {
		jQuery('#menu').removeClass('collapse');
		jQuery('#search-panel').toggleClass('collapse');
		if (jQuery('#search-panel').hasClass('collapse')) {
			window.setTimeout(function() { jQuery('#search-panel .searchform input[type=text]').focus(); },100);
		}
		e.preventDefault();
	});
	if (jQuery('html').hasClass('no-touch')) {
		/* search form toggle - when hovered */
		jQuery('#search-panel').hover(function(e) {
			jQuery('#search-panel #search-toggle').triggerHandler('click');
		},function(e) {
			jQuery('#search-panel').removeClass('collapse');
		});
	}

	// hide search form if ESC character is pressed
	jQuery('#search-panel .searchform input[type=text]').keyup(function(e) {
		if (e.keyCode == 27) {
			jQuery('#search-panel').removeClass('collapse');
		}
	});
	// hide popups if document is clicked outside them
	jQuery(document).click(function(e){
		if (jQuery(e.target).parents('#menu').length > 0) return;
		jQuery('#menu').removeClass('collapse'); // hide the menu panel if user clicks outside it
		if (jQuery(e.target).parents('#search-panel').length > 0) return;
		jQuery('#search-panel').removeClass('collapse'); // hide the search panel if user clicks outside it
	});
	// check for keyboard events - add navigation within the results list
	jQuery('#search-panel .searchform.ajax input[type=text]').on('keypress keydown keyup', function(e){
		switch (e.keyCode) {
			case 13: // RETURN character
				e.preventDefault();
				if (jQuery('#search-panel .searchform .ajax-results .result').length > 0) {
					jQuery('#search-panel').removeClass('collapse');
					window.location.href = jQuery('#search-panel .searchform .ajax-results .focus a').attr('href');
				}
				break;

			case 38: // up
				if (e.type == 'keydown') {
					$focused = jQuery('#search-panel .searchform .ajax-results .focus');
					$prev_focused = $focused.prev(':first');
					if ($prev_focused.length>0) {
						$prev_focused.addClass('focus');
						$focused.removeClass('focus');
					}
				}
				e.preventDefault();
				break;

			case 40:	// down
				if (e.type == 'keydown') {
					$focused = jQuery('#search-panel .searchform .ajax-results .focus');
					$next_focused = $focused.next(':first');
					if ($next_focused.length>0) {
						$next_focused.addClass('focus');
						$focused.removeClass('focus');
					}
				}
				e.preventDefault();
				break;
		}
	});
	// trigger AJAX calls when input has changed
	jQuery('#search-panel .searchform.ajax input[type=text]').on("keyup", function(e) {
		clearTimeout(jQuery.data(this, 'timer'));
		var search_key = jQuery(this).val(); // obtain current search key
		if (search_key == '') {
			jQuery('#search-panel .searchform .ajax-results').fadeOut(); // hide results
		} else {
			if (search_key != jQuery(this).data("search_key") && search_key.length > 1) { // check if a non-character key is pressed
				jQuery(this).data("timer", setTimeout(ajax_search, 100)); // trigger the AJAX search
				jQuery(this).data("search_key", search_key);
			} else {
			}
		};
	});
	function ajax_search() {
		var search_key = jQuery('#search-panel .searchform.ajax input[type=text]').val();
		if(search_key !== '') {
			jQuery.ajax({
				type: "POST",
				url: jQuery('#search-panel .searchform.ajax').data('ajax-action'), // form must have a data-ajax-action attribute to point to the target URL
				data: { s: search_key, l: 6 }, // pass parameters: s - search term, l - limit for results list
				cache: false,
				beforeSend: function() {
					jQuery('#search-panel').addClass('loading');
				},
				success: function(html) {
					jQuery('#search-panel').removeClass('loading');
					jQuery('#search-panel .searchform .ajax-results').html(html).fadeIn(); // load result into the list and fade the panel in
					jQuery('#search-panel .searchform .ajax-results li:first-child').addClass('focus');
				}
			});
		}
		return false;
	}

	/* display hidden comments section */
	jQuery(document).on('click','.show-comments',function (e) {
		e.preventDefault();
		jQuery(this).toggleClass('active').parents('.ajax-post-container').find('.comments-container').toggle();
	});
	/* if the URL contains the #comments hash then activate that section after half a second */
	if (jQuery('.ajax-post-container').length > 0 && window.location.hash == '#comments') {
		setTimeout(function(){
			jQuery('.show-comments').toggleClass('active').parents('.ajax-post-container').find('.comments-container').toggle().intoViewport();
		}, 500);
	}

	// front-end for the 'like' system
	jQuery(document).on('click','.likes',function (e) {
		var likes = parseInt(jQuery('span',this).html()), like_id = jQuery(this).data("id");
		if (!likes || !like_id) return;
		var $like_elem = jQuery('.likes[data-id="' + like_id + '"]');
		if (typeof($filter_container_data) !== "undefined") {
			// like items "temporary stored" for the filterable elements
			$like_elem = $like_elem.add(jQuery('.likes[data-id="' + like_id + '"]',$filter_container_data));
		}
		if ($like_elem.hasClass('done')) {
			jQuery('span',$like_elem).html(likes-1);
		} else {
			jQuery('span',$like_elem).html(likes+1);
		}
		$like_elem.toggleClass('done filled');
		e.preventDefault();
	});

	/* go-to-top functionality */
	var $top_link = jQuery('#top-link');
	$top_link.click(function(e) {
		jQuery('html, body').animate({scrollTop:0}, 750);
		e.preventDefault();
		return false;
	});

	/* callback for window resize */
	jQuery(window).resize(function() {
		var win_width = jQuery(window).width();
		if (win_width >= 768) {
			jQuery(".container .col").css('width','');
			jQuery('.filter-container').css("height", '');
		} else {
			jQuery(".container .col").css('width', (win_width-20) + 'px');
		}
		// fullpage video player resize to cover page viewport
		if (jQuery("#fullpage-video-container").length > 0) {
			var win_height = jQuery(window).height(),
				player_ratio = 16/9;
			if (win_width / player_ratio < win_height) {
				var player_width = Math.ceil(win_height * player_ratio);
				jQuery("#fullpage-video-container iframe").css({
					left: (win_width - player_width) / 2,
					top: 0,
					width: player_width,
					height: win_height,
				});
			} else {
				var player_height = Math.ceil(win_width / player_ratio);
				jQuery("#fullpage-video-container iframe").css({
					left: 0,
					top: (win_height - player_height) / 2,
					width: win_width,
					height: player_height,
				});
			}
		}
	}).resize();

});

/* personal tab script */
(function(a){a.fn.extend({tabify:function(d){function b(e){hash=a(e).find("a").attr("href");hash=hash.substring(0,hash.length-4);return hash}function c(e){a(e).addClass("active");a(b(e)+":hidden").show(0);a(e).siblings("li").each(function(){a(this).removeClass("active");a(b(this)).hide()})}return this.each(function(){var f=this;var e={ul:a(f)};a(this).find("li a").each(function(){a(this).attr("href",a(this).attr("href")+"-tab")});function g(){if(location.hash&&a(f).find("a[href="+location.hash+"]").length>0){c(a(f).find("a[href="+location.hash+"]").parent())}}if(location.hash){g()}setInterval(g,80);a(this).find("li").each(function(){if(a(this).hasClass("active")){a(b(this)).show(0)}else{a(b(this)).hide()}});if(d){d(e)}})}})})(jQuery);

/* personal scroll elements into viewport script */
(function(a){jQuery.fn.intoViewport=function(options){options=a.extend({duration:500,easing:"swing"},options||{});return this.each(function(){function scrTo(dest){a("html,body").stop().animate({scrollTop:dest},options);}var scr=a(document).scrollTop()||a(window).scrollTop(),wheight=a(window).height(),top=a(this).offset().top,eheight=a(this).outerHeight();if(scr>top){scrTo(top);}else if(scr!=top&&top+eheight>scr+wheight){scrTo(top+Math.min(eheight-wheight,0));}});};})(jQuery);
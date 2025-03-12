jQuery(document).ready(function () {
	jQuery('.pagination a').on("click",function(e){
		e.preventDefault();
		if (jQuery(this).hasClass('loading')) return;

		var next_page_href = jQuery(this).attr('href');
		jQuery.ajax({
			url: next_page_href,
			beforeSend: function() {
				jQuery('.pagination a').addClass('loading');
			},
			success: function(html) {
				$new_posts = jQuery('#post-list',html);
				if (jQuery('.pagination a',$new_posts).length == 0) {
					jQuery('.pagination a').remove();
				} else {
					jQuery('.pagination a').attr('href',jQuery('.pagination a:first-child',$new_posts).attr('href'));
				}
				$elements = jQuery('.post',$new_posts).css('opacity',0);
				$elements.first().addClass('first-in-page');
				jQuery('.pagination').before($elements);
				jQuery('.pagination a').removeClass('loading');
				$elements.animate({ opacity: 1 }, 1000).intoViewport();
			},
			error : function() {
				jQuery('.pagination a em').attr('class','icon-cross');
			}
		});
	});
	jQuery(document).on('click','.post h3 a.title',function (e) {
		$post = jQuery(this).parents('.post');
		var slideInAnimation = { opacity: 1, height: 'toggle' }, slideOutAnimation = { opacity: 0, height: 'toggle' }, slideDuration = 500;
		// check if it's already collapsed
		if ($post.hasClass('collapse')) {
			jQuery('.content',$post).stop().animate(slideOutAnimation, slideDuration, function(){
				jQuery(this).parents('.post').removeClass('collapse');
			});
		} else {
			// remove collapse state for all other elements
			jQuery('#post-list .post.collapse .content').animate(slideOutAnimation, slideDuration, function(){
				jQuery(this).parents('.post').removeClass('collapse');
			})
			// check if ajax was already called
			if (jQuery('.content',$post).length == 0) {
				// add ajax container with loading element
				$inner = jQuery('<div class="content" style="display:none"><div class="inner"><em class="ajax-loading icon-cross"></em></div></div>');
				jQuery('h3',$post).after($inner);
				jQuery.ajax({
					url: jQuery('a.title',$post).attr('href'),
					context: $post,
					success: function(html) {
						var $post_content = jQuery('.ajax-post-container',html);
						var $post_inner = jQuery('.inner',this);
						jQuery('.hide-in-ajax-context',$post_content).remove();
						$post_content.css({
							'opacity': 0,
							'display' : 'none'
						});
						setTimeout(function(){
							$post_inner.html($post_content);
							$post_content.animate(slideInAnimation, slideDuration);
						}, slideDuration, $post_content, $post_inner);
					},
					error : function(jqXHR,textStatus,errorThrown) {
						jQuery('.inner',this).html('<p class="grey-text small textcenter no-bottom">' + errorThrown + '</p>');
					}
				});
			}
			$post.addClass('collapse');
			jQuery('.content',$post).css('opacity',0).animate(slideInAnimation, slideDuration, function() {
				jQuery(this).prev().intoViewport();
			})
		}
		e.preventDefault();
	});
});
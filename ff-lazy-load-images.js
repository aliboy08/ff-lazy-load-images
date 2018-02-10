/*!
 * FF Lazyload Images v2.0
 * (c) 2018 Five by Five
 * license: http://www.opensource.org/licenses/mit-license.php
 */
FFLazyLoadImages = function(options = {}){

	// Defaults:
	if( typeof options.showStyle === 'undefined' ) options.showStyle = 'opacity';
	if( typeof options.imageWrap === 'undefined' ) options.imageWrap = {};
	if( typeof options.imageWrap.class === 'undefined' ) options.imageWrap.class = 'image-lazyload-container';
	if( typeof options.imageWrap.tag === 'undefined' ) options.imageWrap.tag = 'span';
	
	if( typeof options.selector === 'undefined') options.selector = 'img';
	if( typeof options.exclude === 'undefined') options.exclude = 'no-lazy';
	
	var images,
		images_count;
	
	function _init(){
		images = selectElements();
		images_count = images.length;
		preventImagesLoad();
		
		// On document ready, load images
		document.onreadystatechange = function(){
			if( document.readyState === 'complete' ) {
				loadImages();
			}
		}
	}
	
	function selectElements(){
		
		var query = document.querySelectorAll(options.selector);
		var itemsToRemove = [];
		if( typeof options.exclude !== 'undefined' ) {
			var exclude = options.exclude.split(' ');
			query.forEach(function(el, index){
				for( i in exclude ) {
					if( el.classList.contains(exclude[i]) ) {
						itemsToRemove.push(index);
						break;
					}
				}
			});
			
			// Turn this object into a loopable array, you can use Array.prototype.slice.call(arrayName)
			query = Array.prototype.slice.call(query);
			// Iterate in reverse to avoid array reindex after splice
			for( var i = itemsToRemove.length-1; i >= 0; --i ) {
				query.splice(itemsToRemove[i], 1);
			}
		}
		
		return query;
	}
	
	function preventImagesLoad(){
		// Prevent Images from loading
		images.forEach(function(el, index){
			var img_src = el.getAttribute('src');
			
			if( options.imageWrap ) {
				// wrap images with a container
				elementWrap(el);
			}
			
			// store initial data in data-src attribute
			el.setAttribute('data-src', img_src);
			el.removeAttribute('src');
			
			elementDisplay(el, 'hide'); // hide
		});
	}
	
	function loadImages(){
		// Load Images
		images.forEach(function(el, index){
			var img_src = el.getAttribute('data-src');
			var img = new Image();
			img.src = img_src;
			img.onload = function() {
				images_count--;
				el.setAttribute('src', img_src);
				
				if( typeof options.animationClass !== 'undefined' ) {
					el.classList.add(options.animationClass); // add animation class
				}
				
				elementDisplay(el, 'show') // show
				
				// On images load complete, run callback
				if( images_count == 0 ) {
					if( typeof options.onComplete === 'function' ) options.onComplete();
				}
			};
		});
	}
	
	function elementWrap(el){
		
		var wrapper = document.createElement(options.imageWrap.tag);
		
		// create wrapper html tag in element parent
		el.parentNode.insertBefore(wrapper, el);
		
		// insert image inside the wrapper
		wrapper.appendChild(el);
		
		// set wrapper class
		wrapper.setAttribute('class', options.imageWrap.class);
		
		// copy element calculated display style to wrapper
		var elCalculatedDisplay = window.getComputedStyle(el, null).getPropertyValue('display');
		if( elCalculatedDisplay === 'none' ) elCalculatedDisplay = 'inline-block';
		wrapper.style.display = elCalculatedDisplay;
		
		// copy element calculated margin
		var elCalculatedMargin = window.getComputedStyle(el, null).getPropertyValue('margin');
		wrapper.style.margin = elCalculatedMargin;
		el.style.margin = '0'; // remove element margin
		
		// set wrapper height based on elemenet
		if(el.getAttribute('width') > 0 && el.getAttribute('height') > 0 ) {
			wrapper.style.width = el.getAttribute('width') + 'px';
			wrapper.style.height = el.getAttribute('height') + 'px';
		}
	}
	
	function elementDisplay(el, state){
		if( state === 'hide' ) {
			// Hide
			if( options.showStyle === 'opacity' ) {
				el.style.opacity = '0';
			} else {
				// get element calculated display
				var calculatedDisplay = window.getComputedStyle(el, null).getPropertyValue('display');
				
				// if element has display none, set to initial
				if( calculatedDisplay === 'none' ) calculatedDisplay = 'initial';
				
				// store initial data in data-display attribute
				el.setAttribute('data-display', calculatedDisplay);
				
				el.style.display = 'none';
			}
			
		} else if ( state === 'show' ) {
			// Show
			if( options.showStyle === 'opacity' ) {
				el.style.opacity = '1';
			} else {
				el.style.display = el.getAttribute('data-display');
				el.removeAttribute('data-display'); // remove stored data
			}
			
			if( options.imageWrap ) {
				// remove wrapper set height and width for fluid style
				el.parentNode.style.height = 'initial';
				el.parentNode.style.width = 'initial';
			}
			
			el.removeAttribute('data-src'); // remove stored data
		}
	}
	
	return {
		init: _init
	}
}
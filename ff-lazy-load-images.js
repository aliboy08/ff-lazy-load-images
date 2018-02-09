FFLazyLoadImages = function(){
	
	var images;
	
	function _init(){
		
		images = document.querySelectorAll('img');
		
		preventImagesLoad();
		
		// On document ready, load images
		document.onreadystatechange = function(){
			if( document.readyState === 'complete' ) {
				loadImages();
			}
		}
	}
	
	function preventImagesLoad(){
		// Prevent Images from loading
		images.forEach(function(element, index){
			var img_src = element.getAttribute('src');
			element.setAttribute('data-src', img_src);
			element.removeAttribute('src');
		});
	}
	
	function loadImages(){
		// Load Images
		images.forEach(function(element, index){
			var img_src = element.getAttribute('data-src');
			var img = new Image();
			img.src = img_src;
			img.onload = function() {
				element.setAttribute('src', img_src);
			};
		});
	}
	
	return {
		init: _init
	}
}
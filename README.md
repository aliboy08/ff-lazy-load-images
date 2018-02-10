# FF Lazy Load Images v2.0

Prevent Images from loading, then load the images when the html document is ready

Script is using native/vanilla javascript, no dependency

To run, call: `FFLazyLoadImages().init();`

```
Options:
 onComplete: function
 animationClass: string
 showStyle: string, options = "opacity"(default) or "display"

 imageWrap: mixed, default object, set to false(boolean) to disable, wrap images in container
 imageWrap: {
   class: string, wrapper class, default = 'image-lazyload-container'
   tag: string, html tag for wrap, default = 'span'
 }
 ```
 
selector: string, default = 'img', for querySelectorAll

exclude: string, class to exclude(without "."), space separated for multiple values

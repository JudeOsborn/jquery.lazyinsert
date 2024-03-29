JQuery Lazy Insert
==================

A jQuery plugin to insert image elements when they appear on screen. Also Removes them when they are not visible. Useful for pages with a LOT of images.

Usage
-----

Apply to image containers, such as a div, specifying the image to insert in the data-image attribute:

	<div class="image-container" data-image="some_image.jpg"></div>

JavaScript declaration:

	$('.image-container').lazyinsert();

Options
-------

 * container: A JQuery element to use as a scrolling container (or window if not specficied).
 * threshold: An offset in pixels, to allow Lazy Insert to do its magic before an item comes on screen.
 * throttle: Optionally throttles the scroll event for performance. Requires the [jquery.ba-throttle-debounce](http://benalman.com/code/projects/jquery-throttle-debounce/docs/files/jquery-ba-throttle-debounce-js.html) plug-in. This is *strongly* recommended.

That's it! Now img tags will be inserted into ".image-container" when the element comes into view, and removed when it scrolls off page.


Copyright (c) 2013 Jude Osborn

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

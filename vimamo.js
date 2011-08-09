var sites = {
  "www.facebook.com": {
    selector: ".uiStreamStory",
    offsetBottom: 30,
    offsetTop: -10
  }
};
var options = sites[location.hostname];

$(document).ready(function() {
  $(options.selector).first().addClass("vimamo-selected");
});

$(document).jkey("j, k", true, function(key) {
  var next,
      current = $(".vimamo-selected"),
      direction = "up";

  if (key === "j") { // down
    next = current.next(options.selector);
    direction = "down";
  } else { // key == "k" up
    next = current.prev(options.selector)
  }

  if (next.length > 0) {
    current.removeClass("vimamo-selected");
    next.addClass("vimamo-selected");

    var elementTop = next.offset().top,
        elementBottom = elementTop + next.height(),
        windowLeft = pageXOffset,
        windowTop = pageYOffset,
        windowBottom = windowTop + $(window).height();

    if (direction === "down") {
      if (elementBottom > windowBottom) {
        window.scrollTo(windowLeft, elementBottom - $(window).height() + options.offsetBottom);
      }
    } else if (elementTop < windowTop) { // up
        window.scrollTo(windowLeft, elementTop + options.offsetTop);
    }
  }
});

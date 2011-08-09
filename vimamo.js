SELECTORS = {
  "www.facebook.com": ".uiStreamStory"  
};
var site = location.hostname;

$(document).ready(function() {
  $(SELECTORS[site]).first().addClass("vimamo-selected");
});

$(document).jkey("j, k", true, function(key) {
  var next,
      current = $(".vimamo-selected"),
      direction = "up";

  if (key === "j") { // down
    next = current.next(SELECTORS[site]);
    direction = "down";
  } else { // key == "k" up
    next = current.prev(SELECTORS[site])
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
        window.scrollTo(windowLeft, elementBottom - $(window).height() + 30);
      }
    } else if (elementTop < windowTop) { // up
        window.scrollTo(windowLeft, elementTop - 10);
    }
  }
});

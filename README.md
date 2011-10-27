#About

A chrome extension that adds basic Vim keyboard shortcuts to websites. It
currently supports `j` (down an item), `k` (up an item), `/` (search) and `ESC` (cancel search) on Facebook, Hacker News, and Tumblr.

## Adding new sites

You can add support for new sites by adding the URL to the `matches` array in
the `manifest.json` file and adding a new object literal to the `sites`
variable in `vimamo.coffee`.

For example, here's how support for Facebook is implemented:

    "www.facebook.com":
      selector: ".uiStreamStory:visible"
      offsetBottom: 40 
      offsetTop: -50
      selectedClass: "vimamo-fb-selected"
      searchSelector: ".uiSearchInput input[type=text]"
      onEnter: -> window.location = $(".vimamo-fb-selected .actorName a").attr("href")

The site is keyed to its domain. The options are:

  * `selector`. jQuery selector for specifying items in the DOM. For example, if all posts have the class _post_, this would be `.post`. Default: `undefined`.
  * `searchSelector`. jQuery selector for specifying the search input field on the site. Default: `undefined`.
  * `getFirst`. A function for getting the item to select when the page first loads. Default: `undefined`.
  * `getNext`. Function for getting the next item on the page (called when the user presses `j`). The function is passed the currently selected item as a jQuery object and should return the next item, also as a jQuery object. Default: `undefined`.
  * `getPrev`. Function for getting the previous item on the page (called when the user presses `k`). The function is passed the currently selected item as a jQuery object and should return the previous item, also as a jQuery object. Default: `undefined`.
  * `onEnter`. Function called when the user presses enter. Default: `undefined`.
  * `selectedClass`. The class added to the selected item. Default: `vimamo-selected`
  * `offsetBottom`. Offset (in pixels) added to the bottom when scrolling to an item. Default: `0`.
  * `offsetTop`. Offset (in pixels) added to the top when scrolling to an item. Default: `0`.

##License

Copyright (c) 2011, Nicholas Bergson-Shilcock. All rights reserved.

SaveMyTweets is released under the GPLv3. See the included LICENSE file or http://www.gnu.org/licenses

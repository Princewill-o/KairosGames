mergeInto(LibraryManager.library, {
  KairosResult: function (json) {
    window.parent.postMessage(JSON.parse(UTF8ToString(json)), window.location.origin);
  }
});

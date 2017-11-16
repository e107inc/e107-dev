import jQuery from "jquery";

(function ($, browser) {
  let parseUrl = (url) => {
    $.ajax({
      url: url,
      type: 'GET',
      success: (res) => {
        let $info = $('.site-info');
        let $text = $('<span></span>');

        if (res.indexOf("e107.settings") >= 0) {
          $text.addClass('success');
          // @todo l10n.
          $text.html("This website uses e107 CMS");
        }
        else {
          $text.addClass('fail');
          // @todo l10n.
          $text.html("This website doesn't use e107 CMS");
        }

        $info.html($text);
      }
    });
  };

  if (browser.tabs) {
    browser.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      parseUrl(tabs[0].url);
    });
  }

})(jQuery, (chrome || browser));

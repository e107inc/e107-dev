(function (browser) {
  // @todo l10n.
  let contexts = {
    '[debug=-]': 'Off',
    'sep1': 'separator',
    '[debug=basic+]': 'Basic',
    '[debug=counts+]': 'Traffic Counters',
    '[debug=showsql+]': 'SQL Analysis',
    '[debug=time+]': 'Time Analysis',
    'sep2': 'separator',
    '[debug=notice+]': 'Notices (PHP)',
    '[debug=warn+]': 'Warnings (PHP)',
    '[debug=backtrace+]': 'Backtraces (PHP)',
    '[debug=deprecated+]': 'Deprecated Functions (PHP)',
    '[debug=inc+]': 'Included Files (PHP)',
    'sep3': 'separator',
    '[debug=paths+]': 'Paths + Variables',
    '[debug=bbsc+]': 'BBCodes + Shortcodes',
    '[debug=sc+]': 'Shortcode Placement',
    'sep4': 'separator',
    '[debug=sql+]': 'SQL Analysis (Detailed)',
    '[debug=everything+]': 'All Details'
  };

  // @see https://developer.chrome.com/apps/contextMenus
  let parent = browser.contextMenus.create({
    // @todo l10n.
    "title": "e107 Devel - Debug Mode"
  });

  let defaultMode = '[debug=-]';

  for (let [mode, label] of Object.entries(contexts)) {
    if (label === 'separator') {
      // @fixme separator breaks default value for radios... the first radio
      // button is always checked in each group.
      // browser.contextMenus.create({
      //   "type": "separator",
      //   "parentId": parent
      // });
      continue;
    }

    browser.contextMenus.create({
      "type": "radio",
      "title": label,
      "parentId": parent,
      "checked": mode === defaultMode,
      "onclick": (info, tab) => {
        let url = tab.url;
        url = url.split("?");

        browser.tabs.update(tab.id, {
          "url": url[0] + '?' + mode
        });
      }
    });
  }

})((chrome || browser));

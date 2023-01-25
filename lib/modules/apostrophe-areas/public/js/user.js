"use strict";

apos.define('apostrophe-areas', {
  construct: function construct(self, options) {
    // Use the super pattern - don't forget to call the original method
    var superEnableCkeditor = self.enableCkeditor;

    self.enableCkeditor = function () {
      superEnableCkeditor(); // Now do as we please

      CKEDITOR.plugins.addExternal('sourcedialog', '/modules/my-apostrophe-areas/js/ckeditorPlugins/sourcedialog/', 'plugin.js');
    };
  }
});
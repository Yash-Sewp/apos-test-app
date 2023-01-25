"use strict";

apos.define('apostrophe-rich-text-widgets-editor', {
  construct: function construct(self, options) {
    self.beforeCkeditorInline = function () {
      self.config.addButtons = 'Underline';
      self.config.extraPlugins = 'sourcedialog';
    };
  }
});
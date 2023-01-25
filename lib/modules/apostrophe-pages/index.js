"use strict";

module.exports = {
  types: [{
    name: 'generic',
    label: 'Generic'
  }, {
    name: 'blank',
    label: 'Blank'
  }],
  construct: function construct(self, options) {
    self.docBeforeUpdate = function (req, page, options, callback) {
      try {
        // Clear the current cache
        self.apos.caches.get('web-cache').clear();
        return setImmediate(callback);
      } catch (err) {
        return callback(err);
      }
    };
  }
};
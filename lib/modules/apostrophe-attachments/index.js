"use strict";

var uploadfs = require('uploadfs-azure');

var mkdirp = require('mkdirp');

module.exports = {
  beforeConstruct: function beforeConstruct(self, options) {
    options.addImageSizes = [{
      name: 'thumbnail',
      width: 100,
      height: 100
    }, {
      name: 'mobile',
      width: 600,
      height: 600
    }, {
      name: 'desktop',
      width: 1920,
      height: 1920
    }];
    options.fileGroups = [{
      name: 'images',
      label: 'Images',
      extensions: ['gif', 'jpg', 'png', 'svg'],
      extensionMaps: {
        jpeg: 'jpg'
      },
      image: true,
      svgImages: true
    }, {
      name: 'office',
      label: 'Office',
      extensions: ['txt', 'rtf', 'pdf', 'xls', 'ppt', 'doc', 'pptx', 'sldx', 'ppsx', 'potx', 'xlsx', 'xltx', 'csv', 'docx', 'dotx', 'svg'],
      extensionMaps: {},
      image: false
    }, {
      name: 'videos',
      label: 'Videos',
      extensions: ['mp4'],
      extensionMaps: {},
      image: false
    }, {
      name: 'acrobat',
      label: 'Acrobat',
      extensions: ['pdf'],
      image: false
    }];
  },
  construct: function construct(self, options) {
    self.initUploadfs = function (callback) {
      mkdirp.sync(self.uploadfsSettings.uploadsPath);
      mkdirp.sync(self.uploadfsSettings.tempPath);
      self.uploadfs = uploadfs();
      self.uploadfs.init(self.uploadfsSettings, callback);
    }; // Custom APIs for attachments


    require('../apostrophe-attachments/lib/api')(self, options);

    self.addHelpers('getDetails');
  }
};
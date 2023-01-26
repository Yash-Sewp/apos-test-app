"use strict";

exports.exports = {
  extend: 'apostrophe-widgets',
  label: 'Hero Banner',
  addFields: [{
    name: 'heading',
    label: 'Heading',
    type: 'string',
    required: true
  }, {
    name: 'subheading',
    label: 'Sub Heading',
    type: 'string',
    required: true
  }, {
    name: 'image',
    label: 'Image',
    type: 'singleton',
    widgetType: 'apostrophe-images',
    options: {
      aspectRatio: [16, 9],
      minSize: [800, 450],
      limit: 1
    },
    required: true
  }, // Should be indi widget with options - Anchor, Modal, Default (Link)
  {
    name: 'Buttons',
    label: 'Buttons',
    limit: 2,
    type: 'array',
    schema: [{
      name: 'buttonLabel',
      label: 'Button Label',
      type: 'string',
      required: true
    }, {
      name: 'buttonLink',
      label: 'Button Link',
      type: 'string',
      required: true
    }]
  }] // Not using JS files in this instance - Added for test purposes
  // construct: function (self, options) {
  // 	self.pushAsset('script', 'add_name', { when: 'always' });
  // }

};
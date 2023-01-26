"use strict";

exports.exports = {
  extend: 'apostrophe-pieces',
  name: 'case-studies',
  label: 'Case Study',
  pluralLabel: 'Case Studies',
  contextual: true,
  addFields: [{
    type: 'string',
    name: 'description',
    label: 'Card Description',
    textarea: true,
    required: true,
    help: 'Displays on the case study listing cards - max 80 characters',
    max: 80
  }, {
    type: 'singleton',
    name: 'featuredImage',
    label: 'Featured image',
    widgetType: 'apostrophe-images',
    required: true,
    options: {
      limit: 1,
      focalPoint: true,
      aspectRatio: [295, 166]
    }
  }],
  arrangeFields: [{
    name: 'basics',
    label: 'General',
    fields: ['title', 'slug', 'description', 'featuredImage']
  }, {
    name: 'settings',
    label: 'Settings',
    fields: ['tags', 'trash', 'published']
  }]
};
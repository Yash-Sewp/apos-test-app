"use strict";

module.exports = {
  addFields: [{
    type: 'array',
    name: 'social_media_accounts',
    label: 'Social Media Accounts',
    titleField: 'social_accounts',
    schema: [{
      type: 'select',
      name: 'icon',
      label: 'Social Accounts',
      required: true,
      choices: [{
        label: 'Facebook',
        value: 'facebook'
      }, {
        label: 'LinkedIn',
        value: 'linkedin'
      }, {
        label: 'Twitter',
        value: 'twitter'
      }, {
        label: 'Google Plus',
        value: 'google-plus'
      }, {
        label: 'Instagram',
        value: 'instagram'
      }, {
        label: 'YouTube',
        value: 'youtube'
      }]
    }, {
      type: 'url',
      name: 'link',
      label: 'Link to social platform',
      required: true
    }]
  }, {
    name: 'buttonLabel',
    label: 'Button Label',
    type: 'string',
    required: true
  }, {
    name: 'buttonLink',
    label: 'Button Link',
    type: 'string',
    required: true
  }],
  arrangeFields: [{
    name: 'footer',
    label: 'Footer Settings',
    fields: ['social_media_accounts']
  }, {
    name: 'header',
    label: 'Header Settings',
    fields: ['buttonLabel', 'buttonLink']
  }]
};
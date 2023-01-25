"use strict";

// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default, and to use jQuery 3.x
module.exports = {
  jQuery: 3,
  stylesheets: [{
    name: 'swiper'
  }, {
    name: 'scss-build'
  }],
  scripts: [{
    name: 'swiper'
  }, {
    name: 'fluidbox'
  }, {
    name: 'popper'
  }, {
    name: 'popper-utils'
  }, {
    name: 'bootstrap'
  }, {
    name: 'site'
  }]
};
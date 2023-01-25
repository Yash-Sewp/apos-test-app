"use strict";

// lib/modules/apostrophe-rich-text-widgets/index.js
module.exports = {
  // The standard list copied from the module, plus sup and sub
  sanitizeHtml: {
    allowedTags: ['h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'u', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'sup', 'sub', 'img'],
    allowedAttributes: {
      '*': ["style", "class", "id"],
      a: ['href', 'name', 'target'],
      // We don't currently allow img itself by default, but this
      // would make sense if we did
      img: ['src', 'alt']
    },
    allowedStyles: {
      '*': {
        // Match HEX and RGB
        'color': [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/]
      }
    },
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel']
  }
};
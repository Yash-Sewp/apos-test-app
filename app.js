//
// Required npm files
//

var moment = require('moment'),
  path = require('path'),
  env = require('dotenv').config(),
  compression = require('compression'),
  appInsights = require('applicationinsights'),
  redirectWWW = function (req, res, next) {
    // Redirect any www version to non www
    if (process.env.REDIRECTWWW == 'TRUE') {
      if (req.headers.host.match(/^www/) !== null) {
        res.redirect(
          'https://' +
          req.headers.host.replace(/^www\./, '') +
          req.url
        );
      } else {
        return next();
      }
    } else {
      return next();
    }
  };

let allowedOrigin = [];

//
// Required variables
//

var db;
var storage;
var assets = {
  less: {
    strictMath: 'on',
  },
};

if (process.env.ENV_TYPE === 'DEVELOP') {
  console.log('Running develop');
  db = { uri: process.env.MONGODB, connect: { useUnifiedTopology: true } };
  storage = {};
  baseUrl = '';
} else if (process.env.ENV_TYPE === 'MASTER') {
  console.log('Running master');
  db = { uri: process.env.MONGODB, connect: { useUnifiedTopology: true } };
  storage = {};
  baseUrl = '';
} else {
  db = { uri: process.env.MONGODB, connect: { useUnifiedTopology: true } };
  storage = {};
  baseUrl = 'http://localhost:3000';
}

// 
// Required azure storage set up
//

if (
  process.env.AZURE_STORAGE_ACCOUNT &&
  process.env.AZURE_STORAGE_KEY &&
  process.env.AZURE_STORAGE_CONTAINER
) {
  // if Azure container details are provided, it will be used to store uploads
  storage = {
    uploadfs: {
      backend: 'azure',
      account: process.env.AZURE_STORAGE_ACCOUNT,
      key: process.env.AZURE_STORAGE_KEY,
      container: process.env.AZURE_STORAGE_CONTAINER,
    },
  };

  // if Azure CDN url is provided, uploads will be requested from it
  if (process.env.AZURE_CDN_URL) {
    storage.uploadfs.cdn = {
      enabled: true,
      url:
        process.env.AZURE_CDN_URL +
        '/' +
        process.env.AZURE_STORAGE_CONTAINER,
    };
  }
}

var apos = require('apostrophe')({
  shortName: 'apos-test-app',
  nestedModuleSubdirs: true,
  baseUrl: baseUrl,
  modules: {
    // Global variable settings
    settings: {
      ignoreNoCodeWarning: true,
      alias: 'settings',
      year: moment().format('YYYY'),
    },

    // Adds page option search to ckeditor
    'apostrophe-rich-text-permalinks': {},
    'apostrophe-attachments': storage,
    'apostrophe-assets': assets,

    'apostrophe-db': db,

    // This module must be activated but should not be configured further,
    // as it improves the `apostrophe-db` module to use the new driver
    'apostrophe-db-mongo-3-driver': {},

    'apostrophe-express': {
      session: {
        secret: process.env.APP_SECRET,
      },
      middleware: [compression(), redirectWWW],
    },
    'apostrophe-pieces-import': {},
    'apostrophe-pieces-orderings-bundle': {},
    'apostrophe-seo': {},
    'apostrophe-templates': {
      viewsFolderFallback: path.join(__dirname, 'views'),
    },
    'apostrophe-headless': {
      bearerTokens: {
        lifetime: 86400 * 7 * 522,
      },
      cors: {
        origin: allowedOrigin,
      },
    },

    'apostrophe-pages-headless': {
      cors: {
        origin: allowedOrigin,
      },
    },

    'apostrophe-pages': {
      restApi: true,
      safeFilters: ['_workflowLocale'],
      filters: {
        ancestors: {
          children: {
            depth: 3,
          },
        },
        children: true,
      },
    },

    'apostrophe-workflow': {
      // IMPORTANT: if you follow the examples below,
      // be sure to set this so the templates work
      alias: 'workflow',
      defaultLocale: 'default',
      // Turning off automatic replication across locales - Users can still export documents between locales
      replicateAcrossLocales: false,

      // Exclude these types from workflow
      excludeTypes: [
        'apostrophe-image',
        'eventTracker',
        'apostrophe-file',
      ],
    },
    'apostrophe-workflow-modified-documents': {},

    // Grouping of admin menu items
    'apostrophe-admin-bar': {
      openOnLoad: false,
      openOnHomepageLoad: false,
      addGroups: [
        {
          label: 'Pieces',
          items: [
            'case-studies'
          ],
        },
        {
          label: 'Attachments and Pages',
          items: [
            'apostrophe-pages',
            'apostrophe-images',
            'apostrophe-files',
            'apostrophe-tags',
          ],
        },
        {
          label: 'Admin',
          items: [
            'apostrophe-users',
            'apostrophe-global',
          ],
        }
      ],
    },
    'apostrophe-caches': {},

    //================================================================
    //
    //  ###    ###   #####   ####    ##   ##  ##      #####   ####
    //  ## #  # ##  ##   ##  ##  ##  ##   ##  ##      ##     ##
    //  ##  ##  ##  ##   ##  ##  ##  ##   ##  ##      #####   ###
    //  ##      ##  ##   ##  ##  ##  ##   ##  ##      ##        ##
    //  ##      ##   #####   ####     #####   ######  #####  ####
    //
    //================================================================

    //
    // Apostrophe Extensions
    //
    'apostrophe-link-widgets': {},
    'apostrophe-users': {
      orderings: true,
    },
    'apostrophe-users-orderings': {
      extend: 'apostrophe-pieces-orderings',
    },
    'hero-banner-widgets': {},
    'case-studies-card-widgets': {},
    'section-title-widgets': {}
  },
});

"use strict";

var async = require('async');

var regeneratorRuntime = require("regenerator-runtime"); // Required for async functionality within ES5


var _require = require('lodash'),
    forEach = _require.forEach;

var moment = require('moment');

var Promise = require('bluebird');

var cors = require('cors');

module.exports = {
  construct: function construct(self, options) {
    var dataCache;
    var superModulesReady = self.modulesReady;

    self.modulesReady = function (callback) {
      return superModulesReady(function (err) {
        if (err) {
          return callback(err);
        }

        dataCache = self.apos.caches.get('web-cache');
        self.customRouteApi();
        self.eventTrackerRouteApi();
        self.smcModelApi();
        self.navBarApi();
        self.notifications();
        self.offers();
        return callback(null);
      });
    }; // Query parameters: slug and locale


    self.customRouteApi = function () {
      var restApi = self.apos.modules['apostrophe-headless'];

      if (!options.restApi || options.restApi.enabled === false) {
        return;
      }

      var baseEndpoint = restApi.endpoint;
      var endpoint = baseEndpoint + '/' + (options.restApi.name || self.__meta.name);
      self.apos.app.use(endpoint + '-workflow', cors(options.cors)); // GET entries based on workflow guid

      self.apos.app.get(endpoint + '-workflow', function (req, res) {
        var slug = req.query.slug;
        var page;
        var response;
        dataCache.get(self.apos.utils.slugify(req.originalUrl)).then(function (cachedData) {
          if (cachedData) {
            return res.send(cachedData);
          } else {
            async.series([find, render], function (err) {
              if (err === 'notfound') {
                return res.status(404).send({
                  error: 'notfound'
                });
              } else if (err === 'badrequest') {
                return res.status(400).send({
                  error: 'badrequest'
                });
              } else if (err) {
                return res.status(500).send({
                  error: 'error'
                });
              }

              response = page;
              dataCache.set(self.apos.utils.slugify(req.originalUrl), response, 60).then(function () {
                return res.send(response);
              });
            });
          }
        });

        function find(callback) {
          // Fetch pages based on slug
          var query = {
            $or: [{
              "type": "generic"
            }, {
              "type": "product"
            }, {
              "type": "blank"
            }, {
              "type": "family"
            }]
          }; // Check for slug, if no slug is provided return all the pages

          if (slug) {
            query.slug = slug;
          } // Specify locale from query, if none is provided draft is returned


          if (req.query.locale) {
            query.workflowLocale = req.query.locale;
          } else {
            query.workflowLocale = 'default-draft';
          } // Cleaning up the response object


          var projection = {
            parkedId: 0,
            parked: 0,
            path: 0,
            rank: 0,
            level: 0,
            titleSortified: 0,
            highSearchText: 0,
            highSearchWords: 0,
            lowSearchText: 0,
            searchSummary: 0,
            viewGroupsIds: 0,
            viewUsersIds: 0,
            editGroupsIds: 0,
            editUsersIds: 0,
            docPermissions: 0,
            editGroupsRelationships: 0,
            editUsersRelationships: 0,
            loginRequired: 0,
            viewGroupsRelationships: 0,
            viewUsersRelationships: 0,
            workflowModified: 0,
            historicUrls: 0,
            advisoryLock: 0,
            workflowLastEditor: 0,
            workflowLastEditorId: 0,
            workflowLastCommitted: 0,
            workflowLocaleForPathIndex: 0,
            trash: 0,
            tags: 0,
            orphan: 0,
            seoRobots: 0,
            pageId: 0,
            applyToSubpages: 0,
            appendPermissionsToSubpages: 0,
            relationships: 0
          }; // MongoDB query

          return self.apos.docs.db.find(query, projection).toArray(function (err, _pages) {
            if (err) {
              return callback(err);
            }

            if (!_pages) {
              return callback('notfound');
            }

            page = _pages;
            return self.apos.attachments.getDetails(page).then(function () {
              return callback(null);
            })["catch"](function (error) {
              console.error(error);
            });
          });
        }

        function render(callback) {
          var restApi = self.apos.modules['apostrophe-headless'];
          return restApi.apiRender(req, self, page, 'page', callback);
        }
      });
    };

    self.eventTrackerRouteApi = function () {
      var restApi = self.apos.modules['apostrophe-headless'];

      if (!options.restApi || options.restApi.enabled === false) {
        return;
      }

      var baseEndpoint = restApi.endpoint;
      var endpoint = baseEndpoint + '/trackers';
      self.apos.app.use(endpoint, cors(options.cors));
      self.apos.app.get(endpoint, function (req, res) {
        var trackers;
        var response;
        dataCache.get(self.apos.utils.slugify(req.originalUrl)).then(function (cachedData) {
          if (cachedData) {
            return res.send(cachedData);
          } else {
            async.series([find, render], function (err) {
              if (err === 'notfound') {
                return res.status(404).send({
                  error: 'notfound'
                });
              } else if (err === 'badrequest') {
                return res.status(400).send({
                  error: 'badrequest'
                });
              } else if (err) {
                return res.status(500).send({
                  error: 'error'
                });
              }

              response = trackers;
              dataCache.set(self.apos.utils.slugify(req.originalUrl), response, 60).then(function () {
                return res.send(response);
              });
            });
          }

          function find(callback) {
            var query = {
              type: 'eventTracker',
              published: true
            }; // Cleaning up the response object

            var projection = {
              published: 0,
              type: 0,
              updatedAt: 0,
              createdAt: 0,
              slug: 0,
              parkedId: 0,
              parked: 0,
              path: 0,
              rank: 0,
              level: 0,
              titleSortified: 0,
              highSearchText: 0,
              highSearchWords: 0,
              lowSearchText: 0,
              searchSummary: 0,
              viewGroupsIds: 0,
              viewUsersIds: 0,
              editGroupsIds: 0,
              editUsersIds: 0,
              docPermissions: 0,
              editGroupsRelationships: 0,
              editUsersRelationships: 0,
              loginRequired: 0,
              viewGroupsRelationships: 0,
              viewUsersRelationships: 0,
              workflowModified: 0,
              historicUrls: 0,
              advisoryLock: 0,
              workflowLastEditor: 0,
              workflowLastEditorId: 0,
              workflowLastCommitted: 0,
              workflowLocaleForPathIndex: 0,
              trash: 0,
              tags: 0,
              orphan: 0,
              seoTitle: 0,
              seoDescription: 0,
              seoRobots: 0,
              pageId: 0,
              applyToSubpages: 0,
              appendPermissionsToSubpages: 0,
              relationships: 0
            }; // MongoDB query

            return self.apos.docs.db.find(query, projection).toArray(function (err, _trackers) {
              if (err) {
                return callback(err);
              }

              if (!_trackers) {
                return callback('notfound');
              }

              trackers = [];

              _trackers.forEach(function (tracker) {
                tracker.eventRef = tracker.title;
                delete tracker.title;
                delete tracker._id;

                if (tracker.processors.length > 0) {
                  tracker.processors.forEach(function (processor) {
                    processor.type = processor.processType;
                    delete processor.processType;
                    delete processor.id;
                  });
                }

                trackers.push(tracker);
              });

              return callback(null);
            });
          }

          function render(callback) {
            var restApi = self.apos.modules['apostrophe-headless'];
            return restApi.apiRender(req, self, trackers, 'trackers', callback);
          }
        });
      });
    };

    self.smcModelApi = function () {
      var restApi = self.apos.modules['apostrophe-headless'];

      if (!options.restApi || options.restApi.enabled === false) {
        return;
      }

      var baseEndpoint = restApi.endpoint;
      var endpoint = baseEndpoint + '/smc';
      self.apos.app.use(endpoint, cors(options.cors));
      self.apos.app.get(endpoint, function (req, res) {
        var smcs;
        var response;
        dataCache.get(self.apos.utils.slugify(req.originalUrl)).then(function (cachedData) {
          if (cachedData) {
            return res.send(cachedData);
          } else {
            async.series([find, render], function (err) {
              if (err === 'notfound') {
                return res.status(404).send({
                  error: 'notfound'
                });
              } else if (err === 'badrequest') {
                return res.status(400).send({
                  error: 'badrequest'
                });
              } else if (err) {
                return res.status(500).send({
                  error: 'error'
                });
              }

              response = smcs;
              dataCache.set(self.apos.utils.slugify(req.originalUrl), response, 60).then(function () {
                return res.send(response);
              });
            });
          }

          function find(callback) {
            var query = {
              type: 'vehicleModels',
              published: true
            }; // Specify locale from query, if none is provided draft is returned

            if (req.query.locale) {
              query.workflowLocale = req.query.locale;
            } else {
              query.workflowLocale = 'default-draft';
            } // Cleaning up the response object


            var projection = {
              published: 0,
              type: 0,
              updatedAt: 0,
              createdAt: 0,
              slug: 0,
              parkedId: 0,
              parked: 0,
              path: 0,
              rank: 0,
              level: 0,
              titleSortified: 0,
              highSearchText: 0,
              highSearchWords: 0,
              lowSearchText: 0,
              searchSummary: 0,
              viewGroupsIds: 0,
              viewUsersIds: 0,
              editGroupsIds: 0,
              editUsersIds: 0,
              docPermissions: 0,
              editGroupsRelationships: 0,
              editUsersRelationships: 0,
              loginRequired: 0,
              viewGroupsRelationships: 0,
              viewUsersRelationships: 0,
              workflowModified: 0,
              historicUrls: 0,
              advisoryLock: 0,
              workflowLastEditor: 0,
              workflowLastEditorId: 0,
              workflowLastCommitted: 0,
              workflowLocaleForPathIndex: 0,
              trash: 0,
              tags: 0,
              orphan: 0,
              seoTitle: 0,
              seoDescription: 0,
              seoRobots: 0,
              pageId: 0,
              applyToSubpages: 0,
              appendPermissionsToSubpages: 0,
              relationships: 0
            }; // MongoDB query

            return self.apos.docs.db.find(query, projection).toArray(function (err, _smcs) {
              if (err) {
                return callback(err);
              }

              if (!_smcs) {
                return callback('notfound');
              }

              smcs = [];
              return self.apos.attachments.getDetails(_smcs).then(function () {
                // Convert title field to smc
                _smcs.forEach(function (smc) {
                  var obj = smc;
                  obj['smc'] = obj.title;
                  delete obj.title;
                  smcs.push(obj);
                });

                return callback(null);
              })["catch"](function (error) {
                console.error(error);
              });
            });
          }

          function render(callback) {
            var restApi = self.apos.modules['apostrophe-headless'];
            return restApi.apiRender(req, self, smcs, 'smcs', callback);
          }
        });
      });
    };

    self.navBarApi = function () {
      var restApi = self.apos.modules['apostrophe-headless'];

      if (!options.restApi || options.restApi.enabled === false) {
        return;
      }

      var baseEndpoint = restApi.endpoint;
      var endpoint = baseEndpoint + '/navbar';
      self.apos.app.use(endpoint, cors(options.cors));
      self.apos.app.get(endpoint, function (req, res) {
        var rangeSlug = req.query.rangeSlug;

        if (!rangeSlug) {
          return res.status(400).send({
            error: 'No rangeSlug supplied'
          });
        }

        var navBar;
        var response;
        dataCache.get(self.apos.utils.slugify(req.originalUrl)).then(function (cachedData) {
          if (cachedData) {
            return res.send(cachedData);
          } else {
            async.series([find, render], function (err) {
              if (err === 'notfound') {
                return res.status(404).send({
                  error: 'notfound'
                });
              } else if (err === 'badrequest') {
                return res.status(400).send({
                  error: 'badrequest'
                });
              } else if (err) {
                return res.status(500).send({
                  error: 'error'
                });
              }

              response = navBar;
              dataCache.set(self.apos.utils.slugify(req.originalUrl), response, 60).then(function () {
                return res.send(response);
              });
            });
          }

          function find(callback) {
            var series = [];
            var query = {
              type: 'secondaryNavBar',
              slug: rangeSlug,
              published: true
            }; // Specify locale from query, if none is provided draft is returned

            if (req.query.locale) {
              query.workflowLocale = req.query.locale;
            } else {
              query.workflowLocale = 'default-draft';
            } // Cleaning up the response object


            var projection = {
              published: 0,
              type: 0,
              updatedAt: 0,
              createdAt: 0,
              parkedId: 0,
              parked: 0,
              path: 0,
              rank: 0,
              level: 0,
              titleSortified: 0,
              highSearchText: 0,
              highSearchWords: 0,
              lowSearchText: 0,
              searchSummary: 0,
              viewGroupsIds: 0,
              viewUsersIds: 0,
              editGroupsIds: 0,
              editUsersIds: 0,
              docPermissions: 0,
              editGroupsRelationships: 0,
              editUsersRelationships: 0,
              loginRequired: 0,
              viewGroupsRelationships: 0,
              viewUsersRelationships: 0,
              workflowModified: 0,
              historicUrls: 0,
              advisoryLock: 0,
              workflowLastEditor: 0,
              workflowLastEditorId: 0,
              workflowLastCommitted: 0,
              workflowLocaleForPathIndex: 0,
              trash: 0,
              tags: 0,
              orphan: 0,
              seoTitle: 0,
              seoDescription: 0,
              seoRobots: 0,
              pageId: 0,
              applyToSubpages: 0,
              appendPermissionsToSubpages: 0,
              relationships: 0
            }; // MongoDB query

            return self.apos.docs.db.find(query, projection).toArray(function (err, _navBar) {
              if (err) {
                return callback(err);
              }

              if (!_navBar) {
                return callback('notfound');
              }

              var subSeries = [];

              if (_navBar && _navBar.length > 0 && _navBar[0].navBarItems && _navBar[0].navBarItems.length > 0) {
                _navBar[0].navBarItems.forEach(function (navItem, index) {
                  if (navItem.itemType == 'anchor' || navItem.itemType == 'default' || navItem.itemType == 'modal') {
                    var itemType = navItem.itemType + 'Button';

                    if (navItem[navItem.itemType + 'Button']['items'].length > 0 && navItem[itemType]['items'][0].eventTrackerId != null && navItem[itemType]['items'][0].eventTrackerId != undefined) {
                      var querySub = {
                        _id: navItem[itemType]['items'][0].eventTrackerId
                      };
                      var projectionSub = {
                        title: 1
                      };
                      var promiseSub = new Promise(function (resolveSub, rejectSub) {
                        self.apos.docs.db.find(querySub, projectionSub).toArray(function (errSub, resultSub) {
                          if (errSub) {
                            rejectSub(errSub);
                          }

                          if (!resultSub | resultSub.length <= 0) {
                            resolveSub({
                              error: 'no event tracker piece with that id'
                            });
                          }

                          _navBar[0].navBarItems[index][itemType]['items'][0].eventTrackerId = resultSub[0].title;
                          resolveSub(_navBar);
                        });
                      });
                      subSeries.push(promiseSub);
                    }
                  }

                  if (navItem.itemType == 'dropdown') {
                    if (navItem.subMenuData.subMenuItems.length > 0) {
                      navItem.subMenuData.subMenuItems.forEach(function (subItem, index2) {
                        if (subItem.button.items.length > 0) {
                          subItem.button.items.forEach(function (subButton, index3) {
                            var itemType = subButton.buttonType + 'Button';

                            if (subButton[itemType]['items'].length > 0 && subButton[itemType]['items'][0].eventTrackerId != null && subButton[itemType]['items'][0].eventTrackerId != undefined) {
                              var querySub = {
                                _id: subButton[itemType]['items'][0].eventTrackerId
                              };
                              var projectionSub = {
                                title: 1
                              };
                              var promiseSubNav = new Promise(function (resolveSub, rejectSub) {
                                self.apos.docs.db.find(querySub, projectionSub).toArray(function (errSub, resultSub) {
                                  if (errSub) {
                                    rejectSub(errSub);
                                  }

                                  if (!resultSub | resultSub.length <= 0) {
                                    resolveSub({
                                      error: 'no event tracker piece with that id'
                                    });
                                  }

                                  _navBar[0].navBarItems[index].subMenuData.subMenuItems[index2].button.items[index3][itemType]['items'][0].eventTrackerId = resultSub[0].title;
                                  resolveSub(_navBar);
                                });
                              });
                              subSeries.push(promiseSubNav);
                            }
                          });
                        }
                      });
                    }
                  }
                });

                if (_navBar[0].navButtons.length > 0) {
                  var countButtons = _navBar[0].navButtons.length;

                  _navBar[0].navButtons.forEach(function (item, index) {
                    //getData(self, button, 'button', series)
                    var itemType = 'button';

                    if (item[itemType]['items'].length > 0 && item[itemType]['items'][0].eventTrackerId != null && item[itemType]['items'][0].eventTrackerId != undefined) {
                      var querySub = {
                        _id: item[itemType]['items'][0].eventTrackerId
                      };
                      var projectionSub = {
                        title: 1
                      };
                      var promiseButton = new Promise(function (resolveSub, rejectSub) {
                        self.apos.docs.db.find(querySub, projectionSub).toArray(function (errSub, resultSub) {
                          if (errSub) {
                            rejectSub(errSub);
                          }

                          if (!resultSub | resultSub.length <= 0) {
                            resolveSub({
                              error: 'no event tracker piece with that id'
                            });
                          }

                          _navBar[0].navButtons[index][itemType]['items'][0].eventTrackerId = resultSub[0].title;
                          resolveSub(_navBar);
                        });
                      });
                      subSeries.push(promiseButton);
                    }
                  });
                }
              }

              if (subSeries.length > 0) {
                Promise.all(subSeries).then(function (_navBar) {
                  navBar = _navBar.length > 0 ? _navBar[0] : _navBar;
                  return callback(null);
                });
              } else {
                navBar = _navBar;
                return callback(null);
              }
            });
          }

          function render(callback) {
            var restApi = self.apos.modules['apostrophe-headless'];
            return restApi.apiRender(req, self, navBar, 'navBar', callback);
          }
        });
      });
    };

    self.notifications = function () {
      var restApi = self.apos.modules['apostrophe-headless'];

      if (!options.restApi || options.restApi.enabled === false) {
        return;
      }

      var baseEndpoint = restApi.endpoint;
      var endpoint = baseEndpoint + '/notifications';
      self.apos.app.use(endpoint, cors(options.cors));
      self.apos.app.get(endpoint, function (req, res) {
        var notifications;
        var response;
        dataCache.get(self.apos.utils.slugify(req.originalUrl)).then(function (cachedData) {
          if (cachedData) {
            return res.send(cachedData);
          } else {
            async.series([find, render], function (err) {
              if (err === 'notfound') {
                return res.status(404).send({
                  error: 'notfound'
                });
              } else if (err === 'badrequest') {
                return res.status(400).send({
                  error: 'badrequest'
                });
              } else if (err) {
                return res.status(500).send({
                  error: 'error'
                });
              }

              response = notifications;
              dataCache.set(self.apos.utils.slugify(req.originalUrl), response, 60).then(function () {
                return res.send(response);
              });
            });
          }

          function find(callback) {
            var currentDate = formatDate();
            var query = {
              type: 'notifications',
              published: true,
              expiryDate: {
                $gte: currentDate
              }
            }; // Specify locale from query, if none is provided draft is returned

            if (req.query.locale) {
              query.workflowLocale = req.query.locale;
            } else {
              query.workflowLocale = 'default-draft';
            } // Cleaning up the response object


            var projection = {
              published: 0,
              type: 0,
              updatedAt: 0,
              createdAt: 0,
              slug: 0,
              parkedId: 0,
              parked: 0,
              path: 0,
              rank: 0,
              level: 0,
              titleSortified: 0,
              highSearchText: 0,
              highSearchWords: 0,
              lowSearchText: 0,
              searchSummary: 0,
              viewGroupsIds: 0,
              viewUsersIds: 0,
              editGroupsIds: 0,
              editUsersIds: 0,
              docPermissions: 0,
              editGroupsRelationships: 0,
              editUsersRelationships: 0,
              loginRequired: 0,
              viewGroupsRelationships: 0,
              viewUsersRelationships: 0,
              workflowModified: 0,
              historicUrls: 0,
              advisoryLock: 0,
              workflowLastEditor: 0,
              workflowLastEditorId: 0,
              workflowLastCommitted: 0,
              workflowLocaleForPathIndex: 0,
              trash: 0,
              orphan: 0,
              seoTitle: 0,
              seoDescription: 0,
              seoRobots: 0,
              pageId: 0,
              applyToSubpages: 0,
              appendPermissionsToSubpages: 0,
              relationships: 0
            }; // MongoDB query

            return self.apos.docs.db.find(query, projection).toArray(function (err, _notifications) {
              if (err) {
                return callback(err);
              }

              if (!_notifications) {
                return callback('notfound');
              }

              notifications = [];
              return self.apos.attachments.getDetails(_notifications).then(function () {
                _notifications.forEach(function (notification) {
                  var obj = notification;

                  if (notification.notificationType === 'modal') {
                    obj['notificationContent'] = notification.modalContent;

                    if (obj.modalContent.content.items.length > 0) {
                      obj['notificationContent']['content'] = notification.modalContent.content.items[0].content;
                    } else {
                      console.error('Content area was not set, this shouldn\'t happen');
                    }

                    var buttonArr = [];
                    notification.modalContent.buttons.forEach(function (holder) {
                      if (holder.button.items.length > 0) {
                        buttonArr.push({
                          label: holder.button.items[0].linkLabel,
                          link: holder.button.items[0].linkUrl,
                          newWindow: holder.button.items[0].linkWindow
                        });
                      } else {
                        console.error('Content area was not set, this shouldn\'t happen');
                      }
                    });
                    obj['notificationContent']['buttons'] = buttonArr;
                  } else if (notification.notificationType === 'link') {
                    if (notification.linkContent.items.length > 0) {
                      obj['notificationContent'] = {
                        label: notification.linkContent.items[0].linkLabel,
                        link: notification.linkContent.items[0].linkUrl,
                        newWindow: notification.linkContent.items[0].linkWindow
                      };
                    } else {
                      console.error('Content area was not set, this shouldn\'t happen');
                    }
                  }

                  obj.date = moment(obj.date).format('D MMMM YYYY');
                  obj.expiryDate = moment(obj.expiryDate).format('DD-MM-YYYY');
                  obj['type'] = notification.notificationType;
                  obj['id'] = notification._id;
                  delete obj._id;
                  delete obj.notificationType;
                  delete obj.modalContent;
                  delete obj.linkContent;
                  delete obj.workflowGuid;
                  delete obj.workflowLocale;
                  notifications.push(obj);
                });

                return callback(null);
              })["catch"](function (error) {
                console.error(error);
              });
            });
          }

          function render(callback) {
            var restApi = self.apos.modules['apostrophe-headless'];
            return restApi.apiRender(req, self, notifications, 'notifications', callback);
          }
        });
      });
    };

    self.offers = function () {
      var restApi = self.apos.modules['apostrophe-headless'];

      if (!options.restApi || options.restApi.enabled === false) {
        return;
      }

      var baseEndpoint = restApi.endpoint;
      var endpoint = baseEndpoint + '/offers';
      self.apos.app.use(endpoint, cors(options.cors));
      self.apos.app.get(endpoint, function (req, res) {
        var offers;
        var response;
        dataCache.get(self.apos.utils.slugify(req.originalUrl)).then(function (cachedData) {
          if (cachedData) {
            return res.send(cachedData);
          } else {
            async.series([find, render], function (err) {
              if (err === 'notfound') {
                return res.status(404).send({
                  error: 'notfound'
                });
              } else if (err === 'badrequest') {
                return res.status(400).send({
                  error: 'badrequest'
                });
              } else if (err) {
                return res.status(500).send({
                  error: 'error'
                });
              }

              response = offers;
              dataCache.set(self.apos.utils.slugify(req.originalUrl), response, 60).then(function () {
                return res.send(response);
              });
            });
          }

          function find(callback) {
            var currentDate = formatDate();
            var query = {
              type: 'vehicleOffers',
              published: true,
              promoEndDate: {
                $gte: currentDate
              }
            }; // Specify locale from query, if none is provided draft is returned

            var workflow;

            if (req.query.locale) {
              query.workflowLocale = req.query.locale;
            } else {
              query.workflowLocale = 'default-draft';
            }

            workflow = query.workflowLocale; // Look up the offers for a specific smc

            var smc;
            if (req.query.smc) smc = req.query.smc;else smc = 'not set'; // Cleaning up the response object

            var projection = {
              published: 0,
              updatedAt: 0,
              createdAt: 0,
              slug: 0,
              parkedId: 0,
              parked: 0,
              path: 0,
              rank: 0,
              level: 0,
              titleSortified: 0,
              highSearchText: 0,
              highSearchWords: 0,
              lowSearchText: 0,
              searchSummary: 0,
              viewGroupsIds: 0,
              viewUsersIds: 0,
              editGroupsIds: 0,
              editUsersIds: 0,
              docPermissions: 0,
              editGroupsRelationships: 0,
              editUsersRelationships: 0,
              loginRequired: 0,
              viewGroupsRelationships: 0,
              viewUsersRelationships: 0,
              workflowModified: 0,
              historicUrls: 0,
              advisoryLock: 0,
              workflowLastEditor: 0,
              workflowLastEditorId: 0,
              workflowLastCommitted: 0,
              workflowLocaleForPathIndex: 0,
              trash: 0,
              orphan: 0,
              seoTitle: 0,
              seoDescription: 0,
              seoRobots: 0,
              pageId: 0,
              applyToSubpages: 0,
              appendPermissionsToSubpages: 0
            }; // MongoDB query

            return self.apos.docs.db.find(query, projection).toArray(function (err, _offers) {
              if (err) {
                return callback(err);
              }

              if (!_offers) {
                return callback('notfound');
              }

              offers = [];
              return self.apos.attachments.getDetails(_offers, smc, workflow).then(function () {
                _offers.forEach(function (offer) {
                  var obj = Object.assign({}, offer);
                  delete obj.vehicleModel;
                  delete obj.vehicleModelsId;

                  if (offer.vehicleModel !== undefined) {
                    if (offer.vehicleModel.length > 0) obj['smc'] = offer.vehicleModel[0].title;
                    if (offer.vehicleModel.length > 0) offers.push(obj);
                  } else {
                    offers['smc'] = 'No vehicle model found, this would only happen is the model was deleted in the CMS or the published value is false';
                    offers.push(obj);
                  }
                });

                return callback(null);
              })["catch"](function (error) {
                console.error(error);
              });
            });
          }

          function render(callback) {
            var restApi = self.apos.modules['apostrophe-headless'];
            return restApi.apiRender(req, self, offers, 'offers', callback);
          }
        });
      });
    };
  }
};

function formatDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}
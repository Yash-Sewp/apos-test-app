"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

var Promise = require('bluebird');

module.exports = function (self, options) {
  self.getDetails = function (within, smc, workflow, callback) {
    if (!within) {
      return false;
    } // If you need to get more complex results back you need to add them to the test here first
    // (attachments and nav bar pieces are covered)


    function test(obj) {
      if (!obj || _typeof(obj) !== 'object') {
        return false;
      }

      if (obj.type == 'apostrophe-images' || obj.type == 'apostrophe-files') {
        // This internal check ensures that the object is attached to a piece
        if (obj.pieceIds.length <= 0) {
          return false;
        }

        return true;
      } else if (obj.type == 'cms-secondary-nav-bar') {
        return true;
      } else if (obj.type == 'vehicleOffers') {
        return true;
      } else if (obj.type == 'apostrophe-rich-text') {
        return true;
      } else if (obj.type == 'cms-link-button' || obj.type == 'cms-anchor-button' || obj.type == 'cms-modal-button') {
        return true;
      } else if (obj.type == 'cms-adaptive-content-banner') {
        return true;
      } else if (obj.type == 'cms-deck' && obj.deckType == 'vehicle') {
        return true;
      } else {
        return false;
      }
    } // We will return an object with the updated values for all attachments contained, this is processed in the walk function below only for apostrophe-images and apostrophe-files


    var response = [];
    var series = [];
    self.apos.docs.walk(within, function (o, key, value, dotPath, ancestors) {
      if (test(value)) {
        // These conditionals will modify the API response to make it easier to read in Angular
        if (value.type == 'apostrophe-images' || value.type == 'apostrophe-files') {
          // Query database to get complete attachment object by looking for the pieceIds
          var docIds = []; // Adding multiple pieceIds to query object if multiple exist

          for (var i = 0; i < value.pieceIds.length; i++) {
            docIds.push({
              '_id': value.pieceIds[i]
            });
          }

          var query = {
            $or: docIds
          }; // Getting only what attachments.url needs for performance reasons

          var projection = {
            'attachment._id': 1,
            'attachment.crop': 1,
            'attachment.group': 1,
            'attachment.name': 1,
            'attachment.title': 1,
            'attachment.extension': 1,
            'attachment.type': 1,
            'attachment.docIds': 1,
            'attachment.width': 1,
            'attachment.height': 1,
            'attachment.landscape': 1,
            'attachment.description': 1,
            'attachment.ownerId': 1
          };
          var promise = new Promise(function (resolve, reject) {
            // This needs to finish for all objects before responding to API request
            self.apos.docs.db.find(query, projection).toArray(function (err, result) {
              if (err) {
                reject(err);
              }

              if (!result || result.length <= 0) {
                resolve({
                  error: "attachment isn't assigned to document"
                });
              } else if (result.length > 0) {
                // Temp store
                var obj; // Check if live is available, if there is live always use that as the response object

                for (var i = 0; i < result.length; i++) {
                  if (result[i].workflowLocale == 'default') {
                    obj = result[i];
                  }
                } // Returns draft attachment if no publish to live is made


                if (obj == undefined || obj == null) {
                  obj = result[0];
                } // Assigning all the url needed based on file type


                value.url = {};

                if (value.type == 'apostrophe-images') {
                  value.url.thumbnail = self.url(obj.attachment, {
                    size: 'thumbnail'
                  });
                  value.url.mobile = self.url(obj.attachment, {
                    size: 'mobile'
                  });
                  value.url.desktop = self.url(obj.attachment, {
                    size: 'desktop'
                  });
                } else if (value.type == 'apostrophe-files') {
                  value.url = self.url(obj.attachment);
                }

                response.push(value);
                resolve(value);
              }
            });
          });
        } else if (value.type == 'vehicleOffers') {
          var query = {
            _id: value.vehicleModelsId,
            workflowLocale: workflow // Get a vehicle model that is live or draft

          }; // Look for a specific vehicle by SMC

          if (smc !== 'not set') {
            query.title = smc;
          } // Limit the response to improve performance


          var projection = {
            title: 1
          };
          var promise = new Promise(function (resolve, reject) {
            // This needs to finish for all objects before responding to API request
            self.apos.docs.db.find(query, projection).toArray(function (err, result) {
              if (err) {
                reject(err);
              }

              if (!result | result.length <= 0) {
                resolve({
                  error: 'no vehicle model piece with that id'
                });
              }

              value.vehicleModel = result;
              response.push(value);
              resolve(value);
            });
          });
        } else if (value.type == 'cms-secondary-nav-bar') {
          var query = {
            _id: value.secondaryNavBarId
          };
          var projection = {
            navBarItems: 1,
            title: 1,
            backButton: 1,
            navButtons: 1
          };
          var promise = new Promise(function (resolve, reject) {
            // This needs to finish for all objects before responding to API request
            self.apos.docs.db.find(query, projection).toArray(function (err, result) {
              if (err) {
                reject(err);
              }

              if (!result | result.length <= 0) {
                resolve({
                  error: 'no nav bar piece with that id'
                });
              }

              value.data = result;
              response.push(value);
              resolve(value);
            });
          }).then(function (value) {
            var subSeries = [];

            if (value && value.data && value.data[0].navBarItems && value.data[0].navBarItems.length > 0) {
              value.data[0].navBarItems.forEach(function (navItem, index) {
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

                        value.data[0].navBarItems[index][itemType]['items'][0].eventTrackerId = resultSub[0].title;
                        resolveSub(value);
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

                                value.data[0].navBarItems[index].subMenuData.subMenuItems[index2].button.items[index3][itemType]['items'][0].eventTrackerId = resultSub[0].title;
                                resolveSub(value);
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

              if (value.data[0].navButtons.length > 0) {
                var countButtons = value.data[0].navButtons.length;
                value.data[0].navButtons.forEach(function (item, index) {
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

                        value.data[0].navButtons[index][itemType]['items'][0].eventTrackerId = resultSub[0].title;
                        resolveSub(value);
                      });
                    });
                    subSeries.push(promiseButton);
                  }
                });
              }
            }

            return Promise.all(subSeries);
          });
        } else if (value.type == 'apostrophe-rich-text') {
          // This is required because all text is rich text components is wrapped in a paragraph tag
          // if no other tag is specified
          if (value.content.substr(0, 3) == '<p>' && value.content.substr(value.content.length - 5, value.content.length) == '</p>\n') {
            value.content = value.content.substr(3, value.content.length - 8);
          }
        } else if (value.type == 'cms-link-button' || value.type == 'cms-anchor-button' || value.type == 'cms-modal-button') {
          var query = {
            _id: value.eventTrackerId
          };

          if (query._id !== null && query._id !== undefined) {
            var projection = {
              title: 1
            };
            var promise = new Promise(function (resolve, reject) {
              // This needs to finish for all objects before responding to API request
              self.apos.docs.db.find(query, projection).toArray(function (err, result) {
                if (err) {
                  reject(err);
                }

                if (!result | result.length <= 0) {
                  resolve({
                    error: 'no event tracker piece with that id'
                  });
                }

                value.eventTrackerId = result[0].title;
                response.push(value);
                resolve(value);
              });
            });
          }
        } else if (value.type == 'cms-adaptive-content-banner') {
          var count = 0;
          value.slides.forEach(function (slide) {
            if (slide.campaign.eventTrackerId !== null) {
              var query = {
                _id: slide.campaign.eventTrackerId
              };
              var projection = {
                title: 1
              };
              var subpromise = new Promise(function (resolve, reject) {
                // This needs to finish for all objects before responding to API request
                self.apos.docs.db.find(query, projection).toArray(function (err, result) {
                  if (err) {
                    reject(err);
                  }

                  if (!result | result.length <= 0) {
                    resolve({
                      error: 'no event tracker piece with that id'
                    });
                  }

                  slide.campaign.eventTrackerId = result[0].title;
                  response.push(value);
                  resolve(value);
                });
              });
              series.push(subpromise);
            }

            count++;
          });
        } else if (value.type == 'cms-deck' && value.deckType == 'vehicle') {
          var queryArr = [];
          value.vehicleData.vehicleItems.forEach(function (item, index) {
            if (item.vehicleModelsId) {
              queryArr.push(item.vehicleModelsId);
            }
          });
          var query = {
            type: "vehicleModels",
            published: true,
            _id: {
              $in: queryArr
            }
          };
          var projection = {
            _id: 1,
            title: 1,
            rangeSlug: 1,
            slug: 1,
            sideImage: 1
          };
          var promise = new Promise(function (resolve, reject) {
            self.apos.docs.db.find(query, projection).toArray(function (err, vehicles) {
              if (err) {
                reject(err);
              }

              if (!vehicles || vehicles.length <= 0) {
                resolve({
                  error: 'no vehicle models found'
                });
              } else {
                for (var _i = 0; _i < vehicles.length; _i++) {
                  for (var j = 0; j < value.vehicleData.vehicleItems.length; j++) {
                    if (vehicles[_i]._id == value.vehicleData.vehicleItems[j].vehicleModelsId) {
                      value.vehicleData.vehicleItems[j].vehicleModel = vehicles[_i];
                    }
                  }
                }

                response.push(value);
                resolve(value);
              }
            });
          });
        }

        series.push(promise);
      }
    });
    return Promise.all(series);
  };
};
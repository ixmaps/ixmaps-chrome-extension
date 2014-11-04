/*jslint node: true */
/* global navigator,chrome, window */

'use strict';

/*
// Imported from manifest.json
var traceLib = window.traceLib;

// Initialize configuration parameters
traceLib.monitor();

// Submitting page visits
// Set up listener for page requests

var requestFilter = {
  urls: [ '<all_urls>' ]
};

chrome.webRequest.onCompleted.addListener(listener, requestFilter);

function listener(item) {
  console.log('Track visit', item);

  var matches = item.url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
  var properties = {
    'url': item.url,
    'title': item.title,
    'domain': matches && matches[1]
  };

  if (position) {
    properties.position = {
      accuracy: position.coords.accuracy,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  }

  traceLib.queueRequest({
    'type': 'chrome.completed',
    'properties': properties
  });
}

// Get geo position

var position;
setTimeout(updatePosition, 5*60*1000);
updatePosition();

function updatePosition() {
  navigator.geolocation.getCurrentPosition(function(_position) {
    position = _position;
  }, function(positionError) {
    position = null;
    console.error(positionError);
  });
}
*/

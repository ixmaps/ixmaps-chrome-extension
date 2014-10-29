/*jslint node: true */
/* global navigator,XMLHttpRequest,chrome, window */

'use strict';

var position, config, requestURL = {};

var traceLib = window.traceLib;

function start(data) {
  if (!data.server || !data.submitter) {
    console.error('Invalid settings', data);
  }
  config = data;
  requestURL = config.server + '/api/requests';
  traceLib.config({ requestURL: requestURL, command: data.command, args: data.args });
  console.log('New settings', data, requestURL, traceLib.stored);
}

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
setTimeout(updatePosition, 5*60*1000);
updatePosition();

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('Changes in settings', changes);
  chrome.storage.sync.get(traceLib.stored, function(data) {
    console.log('data', JSON.stringify(data));
    start(data);
  });
});

chrome.storage.sync.get(traceLib.stored, function(data) {
  start(data);
});

function updatePosition() {
navigator.geolocation.getCurrentPosition(function(_position) {
    position = _position;
  }, function(positionError) {
    position = null;
    console.error(positionError);
  });
}

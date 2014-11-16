/* jslint node: true */
/* global window,XMLHttpRequest */

(function() {
  'use strict';

  // Global configuration
  var config = {};
  var queuedRequest, requests = [];

  // maximum number of queued requests
  var MAX_QUEUE = 100;
  // Values that are stored
  var stored = ['server', 'submitter', 'postalcode', 'command', 'args'];

  window.traceLib = {
    // Export stored values
    stored : stored,
    // Begin watching config setup and changes.
    monitor : function() {
      console.log('monitor');
      // Listen for config changes
      chrome.storage.onChanged.addListener(function(changes, namespace) {
        console.log('Changes in settings', changes);
        chrome.storage.sync.get(stored, function(data) {
          console.log('data', JSON.stringify(data));
          init(data);
        });
      });

      // Get current settings and init
      chrome.storage.sync.get(stored, function(data) {
        console.log('get');
        init(data);
      });
    },

    /// queue and debounce requests
    queueRequest : function(request) {
      if (request.properties && request.properties.url === config.requestURL) {
        return;
      }
      // attach current command args
      request.command = config.command;
      request.args = config.args;
      requests.push(request);
      // reset the timer if MAX_QUEUE hasn't been hit
      if (requests.length < MAX_QUEUE) {
        clearTimeout(queuedRequest);
        queuedRequest = setTimeout(doRequests, 1000);
      }
    },

    // send any queued requests
    doRequests : doRequests
  };

  // Initialize configuration parameters
  function init(data) {
    console.log('init', data);
    if (!data.server || !data.submitter) {
      console.log('Invalid settings', data);
      return;
    }
    stored.forEach(function(f) { config[f] = data[f]; });
    config.requestURL = config.server + '/api/requests';
    console.log('ii', config);
    console.log('init settings', config);
  }

  function doRequests() {
    var sendingRequests = requests.slice(0);
    requests = [];
    var xhr = new XMLHttpRequest();
    xhr.open('POST', config.requestURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function() {
      // requests were sent
      if (xhr.readyState == 4) {
        console.log('sent', config.requestURL, sendingRequests.length, sendingRequests);
      }
    };
    try {
      xhr.send(JSON.stringify({ requests: sendingRequests}));
    } catch (e) {
      console.log('post failed', e);
    }
  }
})();

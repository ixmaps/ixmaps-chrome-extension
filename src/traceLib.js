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
    // current configuration validity
    valid : false,
    // Export stored values
    stored : stored,
    // Initialize configuration parameters
    init : function(data) {
      console.log('init', data);
      if (!data.server || !data.submitter) {
        console.log('Invalid settings', data);
        this.valid = false;
        return;
      }
      stored.forEach(function(f) { config[f] = data[f]; });
      config.requestURL = config.server + '/api/requests';
      console.log('ii', config);
      console.log('init settings', config);
      this.valid = true;
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

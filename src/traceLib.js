/* jslint node: true */
/* global window,XMLHttpRequest */

(function() {
  'use strict';

  var queuedRequest, requests = [];
  var config;

  var MAX_QUEUE = 100;

  window.traceLib = {

    config : function(cfg) {
      config = cfg;
      console.log('config', cfg);
    },

    stored : ['server', 'submitter', 'postalcode', 'command', 'args'],

    /// queue and debounce requests
    queueRequest : function(request) {
      if (request.properties.url !== config.requestURL) {
        // attach current command args
        request.command = config.command;
        request.args = config.args;
        requests.push(request);
        // reset the timer if MAX_QUEUE hasn't been hit
        if (requests.length < MAX_QUEUE) {
          clearTimeout(queuedRequest);
          queuedRequest = setTimeout(doRequests, 1000);
        }
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

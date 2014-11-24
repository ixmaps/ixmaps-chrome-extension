/* jslint node: true */
/* global document,chrome,$,window */
'use strict';

var traceLib = window.traceLib;
var TRSETS_BASE = 'http://ixmaps.ca/trsets/';
$(document).ready(function() {

  // populate with recent hosts
  chrome.history.search({ text: '', maxResults: 10}, function(historyItems) {
    var hostnames = {};
    // hack to get recent hosts
    historyItems.forEach(function(i) {
      var l = document.createElement('a');
      l.href = i.url;
      hostnames[l.hostname] = 1;
    });
    Object.keys(hostnames).forEach(function(h) {
      $('#history').append($('<option />').text(h));
    });
  });

  // retrieve the ixmaps trsets and add them to the select
  $.get(TRSETS_BASE, function(data) {
    $('#trsets').html(data);
    var links = $('#trsets a');
    // re-populate trset select
    $('#trsets a').each(function(k) {
      var l = $(this).attr('href');
      if (l.match(/.*\.trset$/)) {
        l = l.replace('./', '').replace('.trset', '').replace(/_/g, ' ');
        $('#trset').append($('<option />').text(l));
      }
    });
  });

  // Load initial settings
  chrome.storage.sync.get(traceLib.stored, function(data) {
    console.log('storage.get', data);
    traceLib.init(data);

    if (traceLib.valid) {
      traceLib.stored.forEach(function(field) {
        $('#' + field).val(data[field]);
      });
    }
    resetUI();
    // react to other changes
    chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('storage.changed', changes);
      chrome.storage.sync.get(traceLib.stored, function(data) {
        traceLib.init(data);
        resetUI();
      });
    });
  });


  // show options according to config validity
  function resetUI() {
    if (traceLib.valid) {
      setLink();
      $('.needsConfig').show();
    } else {
      $('.needsConfig').hide();
    }
  }

  // User has selected from a list
  $('.selectHost').on('change', function() {
    if ($(this).val()) {
      $('#trhost').val($(this).val());
    }
  });

  // Bind new settings
  $('#saveConfig').click(function() {
    var data = defaultValues();
    chrome.storage.sync.set(data);
  });

  // Submit trset or URL
  $('#traceHost').click(function() {
    var data = defaultValues();
    data.type = 'submitted';
    data.data = $('#trhost').val();
    traceLib.queueRequest(data);
  });

  // update the dashboard link
  function setLink() {
    $('#viewport').attr('src', $('#server').val());
  }
});

// Return the default stored values
function defaultValues() {
  var data = {};
  traceLib.stored.forEach(function(field) {
    data[field] = $('#' + field).val() || '';
  });
  return data;
}

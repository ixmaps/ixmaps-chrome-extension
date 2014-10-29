/* jslint node: true */
/* global document,chrome,$,window */
'use strict';

var traceLib = window.traceLib;

$(document).ready(function() {
  var startTracking = function(data) {
    // Save in storage
    chrome.storage.sync.set(data);
    console.log('UPDATED', data);
  };

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
  $.get('http://ixmaps.ca/trsets/', function( data ) {
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

  // Load settings
  chrome.storage.sync.get(traceLib.stored, function(data) {
    startTracking(data);
    traceLib.stored.forEach(function(field) {
      $('#' + field).val(data[field]);
    });
    setLink();
  });

  // User has selected from a list
  $('.selectHost').on('change', function() {
    if ($(this).val()) {
      $('#trhost').val($(this).val());
    }
  });

  // Bind new settings
  $("#update").click(function() {
    var data = {};
    traceLib.stored.forEach(function(field) {
      data[field] = $('#' + field).val() || '';
    });
    startTracking(data);
    setLink();
  });

  // Submit trset or URL
  $("#submit").click(function() {
    traceLib.queueRequest({
      'type': 'submitted',
      'data': $('.host').val()
    });
  });

  // update the dashboard link
  function setLink() {
    $('#dashboard').html('<a target="IXmapsPaths" href="' + $('#server').val() + '/">Local dashboard</a>');
  }
});

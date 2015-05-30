var _ = require('lodash');
var xray = require('x-ray');
var Promise = require('bluebird');

var flights = {
  kef: function(query, cb) {
    var langs = ['en','is'];
    if (langs.indexOf(query.lang) < 0) {
      query.lang = langs[0];
    }
    var url = 'http://www.kefairport.is/';
    url += query.lang === 'is' ? '/Flugaaetlun' : '/English/Timetables';
    if (query.type === 'departures') {
      url += query.lang === 'is' ? '/Brottfarir/' : '/Departures/';
    } else {
      url += query.lang === 'is' ? '/Komur/' : '/Arrivals/';
    }

    xray(url)
      .select([{
        $root: 'table tr',
        date: 'td:nth-child(1)',
        flightNumber: 'td:nth-child(2)',
        airline: 'td:nth-child(3)',
        to: 'td:nth-child(4)',
        from: 'td:nth-child(4)',
        scheduledTime: 'td:nth-child(5)',
        estimatedTime: 'td:nth-child(6)',
        status: 'td:nth-child(7)'
      }])
      .run(function(err, array) {
        var cleaned = _.map(array, function(flights) {
          if (query.type === 'departures') {
            delete flights.from;
          } else {
            delete flights.to;
          }
         return flights;
        }).filter(function(item){
          return Object.keys(item).length > 0;
        });
        return cb(err, cleaned);
      });
  }
};

module.exports = Promise.promisifyAll(flights);
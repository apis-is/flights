var request = require('request');
var cheerio = require('cheerio');
var err = require('error-helper');

//@TODO Remove the icelandic version and transfer phrases into properties
//@TODO combine plannedArrival realArrival togeather in arrival object...
exports.kef = function(options, callback) {
    var type = options.type
    var urls = {
        'is': {
            departures: 'http://www.kefairport.is/Flugaaetlun/Brottfarir/',
            arrivals: 'http://www.kefairport.is/Flugaaetlun/Komur/'
        },
        'en': {
            departures: 'http://www.kefairport.is/English/Timetables/Departures/',
            arrivals: 'http://www.kefairport.is/English/Timetables/Arrivals/'
        }
    }

    var language = options.language || 'en';

    if (!urls[language] || !urls[language][type]) {
        return callback(err(400,' Bad combintaion of type and language'));
    }

    request.get({
        url: urls[language][type]
    }, function(error, response, body) {
        if (error) {
            return callback(err(403,'www.kefairport.is refuses to respond or give back data'));
        }

        var $ = cheerio.load(body),
            obj = {
                results: []
            };

        var fields = ['date', 'flightNumber', 'airline', 'to', 'from', 'plannedArrival', 'realArrival', 'status'];

        $('table tr').each(function(key) {
            if (key !== 0) {
                var flight = {};

                $(this).find('td').each(function(key) {
                    var val = $(this).html();
                    if (val != '' && val != 0) { // Perform check and add to flight array if it passes
                        flight[fields[key]] = val;

                    }
                });
                obj.results.push(flight);
            }
        });

        return callback(null, obj);
    });
};
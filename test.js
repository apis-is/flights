var flights = require('./');

describe('Flights',function(){
  it('should be able to call it as a promise',function(){
    return flights.kefAsync({
      type: 'arrivals',
      lang: 'en'
    });
  });

  it('should be able to call it with a callback',function(done){
    flights.kef({
      type: 'arrivals',
      lang: 'en'
    },done);
  });
});
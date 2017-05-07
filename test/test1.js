var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});


var db = require('../midleware/db');

describe('DB',function(){
  describe('writealarms',function(){
    it('Should read without errors', function(done){
        db.readData(function(res){
          res.should.have.length(3);
          done();
        });
    });
  });
});
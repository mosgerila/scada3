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
    it('Should write without errors', function(done){
        db.testWriteNormal("'1'" ,function(err,res){
          if (err) return done(err);
          //res.should.have.length(3);
          //assert.equal('done')
          done(err,res);
        });
    });
  });
});





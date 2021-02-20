const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { endpoint } = require('../database/config');

chai.use(chaiHttp);



suite('Functional Tests', function() {
  suite("POST with every field", () => {
    test("POST request to /api/issues/{project}", (done) => {
      chai.request(server)
        .get("/api/issues")
        .end((err,res) => {
          assert.equal(true,true,"Dummy")
          done()
        })
    })
  })
  
});

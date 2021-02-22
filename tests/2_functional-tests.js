const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { endpoint } = require('../database/config');

chai.use(chaiHttp);

let putId;

suite('Functional Tests', () => {
  suite("POST tests", () => {
    test("#1 Create an issue with every field: POST request to /api/issues/{project}", (done) => {
      chai.request(server)
        .post("/api/issues/chaitest")
        .send({
          issue_title: "Title",
          issue_text: "Text",
          created_by: "Chai",
          assigned_to: "Mocha",
          status_text: "Status"
        })
        .end((err,res) => {
          const item = res.body
          putId=item._id
          assert.equal("Title",item.issue_title,"returned title should be Title")
          assert.equal("Text",item.issue_text,"returned text should be Text")
          assert.equal("Chai",item.created_by,"returned created_by should be Chai")
          assert.equal("Mocha",item.assigned_to,"returned assigned_to should be Mocha")
          assert.equal("Status",item.status_text,"returned title should be Status")
          assert.exists(item._id,"returned issue should have an id")
          assert.equal(true,item.open,"issue should be open")
          done()
        })
    })

    test("#2 Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
      chai.request(server)
        .post("/api/issues/chaitest")
        .send({
          issue_title: "Title",
          issue_text: "Text",
          created_by: "Chai"
        })
        .end((err,res) => {
          const item = res.body
          assert.equal("Title",item.issue_title,"returned title should be Title")
          assert.equal("Text",item.issue_text,"returned text should be Text")
          assert.equal("Chai",item.created_by,"returned created_by should be Chai")
          assert.equal("",item.assigned_to,"returned assigned_to should be empty")
          assert.equal("",item.status_text,"returned title should be empty")
          assert.exists(item._id,"returned issue should have an id")
          assert.equal(true,item.open,"issue should be open")
          done()
        })
    })
    
    test("#3 Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
      chai.request(server)
        .post("/api/issues/chaitest")
        .send({
          issue_title: "Title",
          created_by: "Chai",
          assigned_to: "Mocha",
          status_text: "Status"
        })
        .end((err,res) => {
          const item = res.body
          assert.equal("required field(s) missing",item.error,"error should be returned")
          done()
        })
    })
  })
  suite("GET tests", () => {

    test("#4 View issues on a project: GET request to /api/issues/{project}",(done) => {
      chai.request(server)
        .get("/api/issues/chaitest")
        .end((err,res) => {
          const item = res.body
          assert.isArray(item)
          assert.hasAllKeys(item[0],["_id","assigned_to","created_by","created_on","issue_text","issue_title","open","status_text","updated_on"])
          done()
        })
    })
    
    test("#5 View issues on a project with one filter: GET request to /api/issues/{project}",(done) => {
      chai.request(server)
        .post("/api/issues/chaitest")
        .send({
          issue_title: "Title",
          issue_text: "Text",
          created_by: "FindMe"
        })
        .end()
      chai.request(server)
        .get("/api/issues/chaitest?created_by=FindMe")
        .end((err,res) => {
          const item = res.body
          assert.isArray(item)
          assert.hasAllKeys(item[0],["_id","assigned_to","created_by","created_on","issue_text","issue_title","open","status_text","updated_on"])
          assert.equal(item[0]["created_by"],"FindMe")
          done()
        })
    })
    
    test("#6 View issues on a project with multiple filters: GET request to /api/issues/{project}",(done) => {
      chai.request(server)
        .post("/api/issues/chaitest")
        .send({
          issue_title: "Title",
          issue_text: "FindMe",
          created_by: "FindMeToo"
        })
        .end()
      chai.request(server)
        .get("/api/issues/chaitest?issue_text=FindMe&created_by=FindMeToo")
        .end((err,res) => {
          const item = res.body
          assert.isArray(item)
          assert.hasAllKeys(item[0],["_id","assigned_to","created_by","created_on","issue_text","issue_title","open","status_text","updated_on"])
          assert.equal(item[0]["issue_text"],"FindMe")
          assert.equal(item[0]["created_by"],"FindMeToo")
          done()
        })
    })
  })

  suite("PUT tests", () => {
    test("#7 Update one field on an issue: PUT request to /api/issues/{project}",(done) => {
      chai.request(server)
        .put("/api/issues/chaitest")
        .send({
          _id: putId,
          created_by: "Changed"
        })
        .end((err, res) => {
          const item = res.body
          assert.deepEqual(item, {
            result: 'successfully updated',
            _id: putId
          })
          done()
        })
    })
    // 
      test("#8 Update multiple fields on an issue: PUT request to /api/issues/{project}",(done) => {
        chai.request(server)
          .put("/api/issues/chaitest")
          .send({
            _id: putId,
            created_by: "ChangedAgain",
            issue_title: "ChangedToo"
          })
          .end((err, res) => {
            const item = res.body
            assert.deepEqual(item, {
              result: 'successfully updated',
              _id: putId
            })
            done()
          })
      })
    // 
      test("#9 Update an issue with missing _id: PUT request to /api/issues/{project}",(done) => {
        chai.request(server)
          .put("/api/issues/chaitest")
          .send({
            created_by: "ChangedAgain",
            issue_title: "ChangedToo"
          })
          .end((err, res) => {
            const item = res.body
            assert.deepEqual(item, {
              error: 'missing _id'
            })
            done()
          })
      })

    // 
      test("#10 Update an issue with no fields to update: PUT request to /api/issues/{project}",(done) => {
        chai.request(server)
          .put("/api/issues/chaitest")
          .send({
            _id: putId
          })
          .end((err, res) => {
            const item = res.body
            assert.deepEqual(item, { error: 'no update field(s) sent', '_id': putId })
            done()
          })
      })

    // 
      test("#11 Update an issue with an invalid _id: PUT request to /api/issues/{project}",(done) => {
        chai.request(server)
          .put("/api/issues/chaitest")
          .send({
            _id: "DoesNotExist"
          })
          .end((err, res) => {
            const item = res.body
            assert.deepEqual(item, { error: 'no update field(s) sent', '_id': "DoesNotExist" })
            done()
          })
      })
  })
  suite("DELETE tests", () => {
    // 
      test("#12 Delete an issue: DELETE request to /api/issues/{project}",(done) => {
        chai.request(server)
          .delete("/api/issues/chaitest")
          .send({
            _id: putId
          })
          .end((err, res) => {
            const item = res.body
            assert.deepEqual(item, { result: 'successfully deleted', '_id': putId })
            done()
          })
      })
    // 
    test("#13 Delete an issue with an invalid _id: DELETE request to /api/issues/{project}",(done) => {
      chai.request(server)
        .delete("/api/issues/chaitest")
        .send({
          _id: "Invalid"
        })
        .end((err, res) => {
          const item = res.body
          assert.deepEqual(item, { error: 'could not delete', '_id': "Invalid" })
          done()
        })
    })
    // 
    test("#14 Delete an issue with missing _id: DELETE request to /api/issues/{project}",(done) => {
      chai.request(server)
        .delete("/api/issues/chaitest")
        .send({
          
        })
        .end((err, res) => {
          const item = res.body
          assert.deepEqual(item, { error: 'missing _id' })
          done()
        })
    })
  })
  
});

'use strict';
const db = require("../database/db.js")
db.createDb();

module.exports = function (app) {

  

  app.route('/api/issues/:project')
  
  .get(function (req, res){
    let project = req.params.project;

    const getIssue = async () => {
      // try fetching results
      try {
        // pass in project rather than id, and the url query for filtering
        const response = await db.selectIssue(null,project, req.query)
        return res.json(response)
      } catch (error) {
        console.log(error)
        return res.json({ "error": error })
      }
    } 

    getIssue()
  })
  
  .post(function (req, res){
    // get form fields
    let project = req.params.project;
    const { assigned_to, created_by, issue_text, issue_title, status_text } = req.body;

    if(issue_title===""||issue_text===""||created_by===""||issue_title===undefined||issue_text===undefined||created_by===undefined)
      return res.json({error:'required field(s) missing'})

    //build project to submit to db
    const issue = { 
      project,
      assigned_to, 
      created_by,
      created_on: new Date(), 
      issue_text, 
      issue_title,
      open: true, 
      status_text,
      updated_on: new Date() 
    }

    const addIssue = async () => {
      //try adding project to db
      try {
        // add then return the response
        const response = await db.createIssue(issue)
        res.json(response)
      } catch (e) {
        // else log and throw error
        console.log(e)
        res.json({"error":e})
      }
    }
    addIssue()
  })
  
  .put(function (req, res){
    // get vars from body
    //const { _id, assigned_to, created_by, issue_text, issue_title,status_text } = req.body
    const issue = req.body
    const _id=req.body._id

    const updateIss = async () => {
      try {
        // if no id then return error
        if(!_id)
          return res.json({ error: 'missing _id' })
        
        // if no fields to update return error
        if( !issue["issue_title"] && !issue["issue_text"] && !issue["created_by"] && !issue["assigned_to"] && !issue["status_text"] && !issue["open"])
          return res.json({ error: 'no update field(s) sent', _id })
        
        // otherwise update object and return the id
        const response = await db.updateIssue(issue)
        if(response)
          return res.json({  result: 'successfully updated', '_id': req.body._id })
        else throw "No response"
      } catch (error) {
        console.log(error)
        return res.json({ error: 'could not update', _id })
      }
    }
    
    updateIss()

    
  })
  
  .delete(function (req, res){
    let project = req.params.project;
    let id = req.body._id;

    // if id is blank return error
    if(!id)
      return res.json({error: "missing _id"})

    const delProject = async () => {
      try {
        // attempt to delete resposne
        const response = await db.deleteIssue(id)

        // return success if there is a response
        if(response)
          res.json({result:'successfully deleted','_id':id})

        // return error if no response (due to returning null in the deleteProject method)
        else throw "No response"
      } catch (e) {
        console.log(e)
        res.json({error: 'could not delete', '_id': id})
      }
    }

    delProject()    
  });
}
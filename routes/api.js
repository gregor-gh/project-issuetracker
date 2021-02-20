'use strict';
const db = require("../database/db.js")
db.createDb();

module.exports = function (app) {

  

  app.route('/api/issues/:project')
  
  .get(function (req, res){
    let project = req.params.project;

    const getProject = async () => {
      // try fetching results
      try {
        const response = await db.selectProject(project)
        return res.json(response)
      } catch (error) {
        console.log(error)
        return res.json({ "error": error })
      }
    } 

    getProject()
  })
  
  .post(function (req, res){
    // get form fields
    const { assigned_to, created_by, issue_text, issue_title, status_text } = req.body;

    if(issue_title===""||issue_text===""||created_by==="")
      return res.json({error:"required field(s) missing"})

    //build project to submit to db
    const project = { 
      assigned_to, 
      created_by,
      created_on: new Date(), 
      issue_text, 
      issue_title,
      open: true, 
      status_text,
      updated_on: new Date() 
    }

    const addProject = async () => {
      //try adding project to db
      try {
        // add then return the response
        const response = await db.createProject(project)
        res.json(response)
      } catch (e) {
        // else log and throw error
        console.log(e)
        res.json({"error":e})
      }
    }
    addProject()
  })
  
  .put(function (req, res){
    // get vars from body
    const { _id, assigned_to, created_by, issue_text, issue_title,status_text } = req.body

    // TODO first check item exists by selecting
    
  })
  
  .delete(function (req, res){
    let project = req.body._id;

    // if id is blank return error
    if(project==="")
      return res.json({error: "missing_id"})

    const delProject = async () => {
      try {
        // attempt to delete resposne
        const response = await db.deleteProject(project)

        // return success if there is a response
        if(response)
          res.json({result:'successfully deleted','_id':project})

        // return error if no response (due to returning null in the deleteProject method)
        else
          res.json({error: 'could not delete ', '_id': project})
      } catch (e) {
        console.log(e)
        res.json({"error":e})
      }
    }

    delProject()    
  });
}
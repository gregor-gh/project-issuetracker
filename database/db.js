require("dotenv").config();
const CosmosClient = require("@azure/cosmos").CosmosClient
const config = require("./config");
const databaseContext = require("./databaseContext");

// create client obj db
const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

const createDb = async() => {
  // ensure db exists, if not create
  await databaseContext.create(client, databaseId, containerId);
}

const createIssue = async(proj) => {
  try {

    if(proj.status_text===undefined)
      proj.status_text=""

    if(proj.assigned_to===undefined)
      proj.assigned_to=""

    // create project and get repsonse
    const { resource: createdItem } = await container.items.create(proj)

    // remove unneeded fields from response
    const { id } = createdItem;

    const returnItem = await selectIssue(id,null,{})

    return returnItem[0];
  }
  catch(e) { 
    console.log(e)
    return {"error":e}
  }  
}

const selectIssue = async(id, project, filter) => {
  try {
    let query = `select c.assigned_to, c.status_text, c.open, c.id as _id, c.issue_title, c.issue_text, c.created_by, c.created_on, c.updated_on 
    from c where `
    const { open, issue_title, issue_text, assigned_to, created_by, status_text } = filter
    
    // filter by either id or project
    if(id) query+=`c.id='${id}'`
    else query+=`c.project='${project}'`

    if(open) query+=` and c.open=${open}`
    if(issue_title) query+=` and c.issue_title='${issue_title}'`
    if(issue_text) query+=` and c.issue_text='${issue_text}'`
    if(assigned_to) query+=` and c.assigned_to='${assigned_to}'`
    if(created_by) query+=` and c.created_by='${created_by}'`
    if(status_text) query+=` and c.status_text='${status_text}'`
    

    const { resources: items } = await container.items
      .query(query)
      .fetchAll();
      return items
      
  } catch (e) {
    console.log(e)
    return {"error":e}
  }
}

const deleteIssue = async(id) => {
  try {
    // select to get cosmos colleciton key for deletion 
    const select = await selectIssue(id,null,{})

    // if nothing reutrned by this select then the id does not exist
    if(select.length===0)
      return null

    // assignedto is the key
    const assigned_to = select[0].assigned_to

    // delete by key and id
    const result = await container.item(id, assigned_to).delete();

    return result
    
  } catch (e) {
    console.log(e)
    return {"error":e}
  }
}

const updateIssue = async(issue) => {
  try {
    // first select the current update
    const select = await selectIssue(issue._id,null,{})
    const selectedItem = select[0]

    const {_id, ...updates} = issue

    const updatedIssue = {...selectedItem, ...updates}
    const updatedIssueWithDate = {...updatedIssue, "updated_on": new Date()};
    // const {_id, ...updatedIssueWithoutId } = updatedIssueWithDate
     const updatedIssueWithId = {...updatedIssueWithDate, id: _id}
    
    const { resource : updatedItem } = await container
      .item(_id)
      .replace(updatedIssueWithId)

    return updatedItem

    //

  } catch (error) {
    console.log(error)
  }
}

module.exports = { createDb, createIssue, selectIssue, deleteIssue, updateIssue }
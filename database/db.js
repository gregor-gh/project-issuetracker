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

    const returnItem = await selectIssue(id)

    return returnItem[0];
  }
  catch(e) { 
    console.log(e)
    return {"error":e}
  }  
}

const selectIssue = async(id,project) => {
  try {
    let query = `select c.assigned_to, c.status_text, c.open, c.id as _id, c.issue_title, c.issue_text, c.created_by, c.created_on, c.updated_on 
    from c where `

    if(id) query+=`c.id='${id}'`
    else query+=`c.project='${project}'`

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
    const select = await selectIssue(id)

    // if nothing reutrned by this select then the id does not exist
    if(select.length===0)
      return null

    // assignedto is the key
    const assigned_to = select[0].assigned_to

    // delete by key and id
    const result = await container.item(id, assigned_to).delete();
    console.log(result)
    return result
    
  } catch (e) {
    console.log(e)
    return {"error":e}
  }
}

module.exports = { createDb, createIssue, selectIssue, deleteIssue }
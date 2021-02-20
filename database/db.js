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

const createProject = async(project) => {
  try {
    // create project and get repsonse
    const { resource: createdItem } = await container.items.create(project)

    // remove unneeded fields from response
    const { _rid, _self, _etag, _attachments, _ts, ...returnedItem } = createdItem;


    const _id = returnedItem.id
    const { id, ...returnedItemMod} = { ...returnedItem, _id }
    
    return returnedItemMod;
  }
  catch(e) { 
    console.log(e)
    return {"error":e}
  }  
}

const selectProject = async(id) => {
  try {
    let query = `select c.assigned_to, c.created_by, c.created_on, c.issue_text, c.issue_title, c.open, c.status_text, c.updated_on, c.id as _id from c`

    if(id!=="apitest")
      query+=` where c.id='${id}'`

    const { resources: items } = await container.items
      .query(query)
      .fetchAll();
      return items
      
  } catch (e) {
    console.log(e)
    return {"error":e}
  }
}

const deleteProject = async(id) => {
  try {
    // select to get cosmos colleciton key for deletion 
    const select = await selectProject(id)

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

module.exports = { createDb, createProject, selectProject, deleteProject }
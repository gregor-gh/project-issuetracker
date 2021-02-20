require("dotenv").config()

const config = {
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
  databaseId: "FreeCodeCamp",
  containerId: "IssueTracker",
  partitionKey: {kind: "Hash", paths: ["/assigned_to"]}
};

module.exports = config

//import GlobalStyle from 'carbon-react/lib/style/global-style';
import "./App.css"
import React from 'react';
//import { BrowserRouter as Router, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { ThemeProvider } from "styled-components";
import mintTheme from "carbon-react/lib/style/themes/mint";
import AppWrapper from "carbon-react/lib/components/app-wrapper";

import IssueTable from "./components/IssueTable.js"
import NavBar from "./components/NavBar.js"
import AddIssue from "./components/AddIssue.js";
import ToastPop from "./components/ToastPop.js"

function App() {

  // the list of issues gottne from the database, used in issuetable
 const [issueList, setIssueList] = useState([])

 // the flag to determine whether the add issue form is opne, also used for updating
 const [addIssueOpen, setAddIssueOpen] = useState(false)

 // the flag to determine whether the "x was successful" toast appears
 const [toastOpen, setToastOpen] = useState(false)

 // the var that passes the toast messsage from the add/edit/delete processes to the toast
 const [toastMessage, setToastMessage] = useState("")

 // the flag that determines whether the "add update" screen will open in add or edit mode
 const [addOrUpdate, setAddOrUpdate] = useState("add")

 // object to store the initial values for use when the edit option is launched.
 // also stores the id sent to the api
 const [editInitVals, setEditInitVals] = useState({
   _id: "",
   title: "",
   details: "",
   assigned: "",
   status: ""
 })

  useEffect(() => {
    getIssues()
    return () => {
      console.log("loaded")
    }
  }, [])

  // method for getting list of issues from API
  const getIssues = async () => {
    try {
      const response = await fetch("/api/issues/apitest")
      const data = await response.json()
      
      setIssueList(data)
    } catch (error) {
      console.log(error)
    }
  }
  
  // method for sending insert to API
  const addIssue = async () => {

    // build FormData from fields on the add issue dialog
    let formData = new FormData()
    formData.append("issue_title",editInitVals.title)
    formData.append("issue_text",editInitVals.details)
    formData.append("assigned_to",editInitVals.assigned)
    formData.append("status_text",editInitVals.status)
    formData.append("created_by","Administrator")
    // add id if it's an update
    addOrUpdate==="Update" && formData.append("_id",editInitVals._id)

    //convert to search params for fetch
    const body = new URLSearchParams(formData)

    // set methdd according to whether it's an add or update
    const method = addOrUpdate==="Add"? "POST":"PUT"

    const response = await fetch("/api/issues/apitest", {method, body})
    const data = await response.json()
    console.log(data)

    // update user via toast
    if(addOrUpdate==="Add") {
      setToastMessage("Issue created successfully")
    } else {
      setToastMessage("Issue updated successfully")      
    }
    setToastOpen(true)

    // refresh list
    getIssues();
  }

  const deleteIssue = async (_id) => {
    // build formdata using the id
    let formData = new FormData()
    formData.append("_id",_id)

    const body = new URLSearchParams(formData) 

    const response = await fetch("/api/issues/apitest", {
      method:"DELETE",
      body })
    const data = await response.json()
    console.log(data)

    // update user via toast
    setToastMessage("Issue deleted successfully")
    setToastOpen(true)

    // refresh list
    getIssues();

  }

  return (
<ThemeProvider theme={mintTheme}>
  <AppWrapper>
    <NavBar 
      addIssueOpen={addIssueOpen} 
      setAddIssueOpen={setAddIssueOpen}
      setAddOrUpdate={setAddOrUpdate}
      setEditInitVals={setEditInitVals}/>
    <IssueTable 
      issueList={issueList}
      setAddIssueOpen={setAddIssueOpen}
      setAddOrUpdate={setAddOrUpdate}
      setEditInitVals={setEditInitVals}
      deleteIssue={deleteIssue}/>
    <AddIssue 
      addIssueOpen={addIssueOpen} 
      setAddIssueOpen={setAddIssueOpen}
      addIssue={addIssue}
      addOrUpdate={addOrUpdate}
      editInitVals={editInitVals}
      setEditInitVals={setEditInitVals}/>
    <ToastPop 
      toastMessage={toastMessage}
      toastOpen={toastOpen}
      setToastOpen={setToastOpen}/>
  </AppWrapper>
</ThemeProvider>
  );
}

export default App;

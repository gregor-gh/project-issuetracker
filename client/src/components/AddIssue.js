import React from 'react'
import { useState } from "react"
//import Typography from "carbon-react/lib/components/typography"
import Form from "carbon-react/lib/components/form"
import Dialog from "carbon-react/lib/components/dialog"
//import Textbox from "carbon-react/lib/__experimental__/components/textbox";
import Button from "carbon-react/lib/components/button"
import AddIssueTextbox from "./AddIssueTextbox.js"



// add issue pop up dialog box, also used for update (depending on addOrUpdate)
const AddIssue = ({ addIssueOpen, setAddIssueOpen, addIssue, addOrUpdate, editInitVals, setEditInitVals }) => {

  const [errorCount, setErrorCount] = useState(0)

  const onSubmit = (e) => {
    // prevent page refresh
    e.preventDefault()

    // reset error count to zero then increment if either of the two require dfields are empty
    setErrorCount(0)
    if(editInitVals.title==="" && editInitVals.details==="") return setErrorCount(2)
    if(editInitVals.title==="" || editInitVals.details==="") return setErrorCount(1)
    setErrorCount(0)
    
    // add issue will add or update depending on the addOrUpdate value
      addIssue()
    
    setAddIssueOpen(false)
  }

  return (
    <Dialog open={addIssueOpen} title={addOrUpdate+" Issue"}subtitle="Please enter issue details">
    <Form stickyFooter={true} 
      onSubmit={onSubmit}
      leftSideButtons={<Button onClick={() => setAddIssueOpen(!addIssueOpen)}>
                        Cancel
                      </Button>}
       saveButton={<Button buttonType='primary' type="submit">
                    Save
                  </Button>}
      fieldSpacing={2}
      errorCount={errorCount}
    >
      <AddIssueTextbox 
        text="Issue Title"
        fieldKey="title"
        required="true"
        editInitVals={editInitVals}
        setEditInitVals={setEditInitVals}
        />
      <AddIssueTextbox 
        text="Issue Details"
        fieldKey="details"
        required="true"
        editInitVals={editInitVals}
        setEditInitVals={setEditInitVals} />
      <AddIssueTextbox 
        text="Assigned To"
        fieldKey="assigned"
        editInitVals={editInitVals}
        setEditInitVals={setEditInitVals} />
      <AddIssueTextbox 
        text="Status"
        fieldKey="status"
        editInitVals={editInitVals}
        setEditInitVals={setEditInitVals} />
    </Form>
  </Dialog>
  )
}

export default AddIssue

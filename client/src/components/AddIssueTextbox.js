import React from 'react'
import Textbox from "carbon-react/lib/__experimental__/components/textbox";

const AddIssueTextbox = ({ text, fieldKey, required, editInitVals, setEditInitVals }) => {

  return (
    <Textbox 
      size="small" 
      required={required}
      label={text}
      value={editInitVals[fieldKey]}
      onChange={(e) => setEditInitVals({...editInitVals, [fieldKey]: e.target.value})}/>
  )
}

export default AddIssueTextbox

//onChange={(e) => setField(e.target.value)}/>
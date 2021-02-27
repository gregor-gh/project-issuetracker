import React from 'react'
import { useState } from "react"
import { FlatTable,FlatTableRow,FlatTableHead,FlatTableHeader,FlatTableBody,FlatTableCell } from "carbon-react/lib/components/flat-table"
import Pager from "carbon-react/lib/components/pager"
import { ActionPopover, ActionPopoverItem } from "carbon-react/lib/components/action-popover"

const IssueTable = ({ issueList, setAddIssueOpen, setAddOrUpdate, setEditInitVals, deleteIssue }) => {
// TODO implment sorting? looks like a pain
// TODO implement preview while data is loading?

  // map through the elements returned by the getIssues method and create a table row for each one
  const issueData = issueList.map((el, index) => {
    // extract vars from array
    const _id = el._id
    const title = el.issue_title
    const details = el.issue_text
    const assigned = el.assigned_to
    const status = el.status_text

    return (
      <FlatTableRow key={index}>
      <FlatTableCell>{title}</FlatTableCell>
      <FlatTableCell>{details}</FlatTableCell>
      <FlatTableCell>{assigned}</FlatTableCell>
      <FlatTableCell>{status}</FlatTableCell>
      <FlatTableCell>
        <ActionPopover>
        <ActionPopoverItem 
          icon="edit" 
          onClick={
            () => editClick(_id,title,details,assigned,status)}>
                  Edit
                </ActionPopoverItem>
                <ActionPopoverItem 
                  icon="delete" 
                  onClick={
                    () => deleteClick(_id)}>
                  Delete
                </ActionPopoverItem>
        </ActionPopover>
      </FlatTableCell>
    </FlatTableRow>
    )
  })

  const editClick = (_id, title, details, assigned, status) => {
    // set the form type to update
    setAddOrUpdate("Update")

    // set the init values for use in the add issue form
    setEditInitVals({ _id, title, details, assigned, status })

    //launch form 
    setAddIssueOpen(true)
  }

  const deleteClick = (_id) => {
    deleteIssue(_id)
  }

  const [recordsRange, setRecordsRange] = useState({ start: 0, end: 5 })
  const [currentPage, setCurrentPage] = useState(1)

  const renderRows = () => {
    const { start, end } = recordsRange
    if (start < 0) return issueData
    if (end> issueData.length) return issueData.slice(start, issueData.length)
    return issueData.slice(start, end)
  }

  const handlePagination = (newPage, newPageSize) => {
    const start = (newPage - 1) * newPageSize
    const end = start + newPageSize
    setRecordsRange({ start, end })
    setCurrentPage(newPage)
  }

  const pageSizeOptions = [
    { id: "5", name: 5 },
    { id: "10", name: 10 }
  ]


  return (
    <div id="issue-list">
      <FlatTable isZebra hasStickyHead hasStickyFooter footer = {
          <Pager totalRecords={issueData.length} 
            showPageSizeSelection 
            pageSize={5}
            currentPage={currentPage}
            onPagination={(next, size) => handlePagination(next, size)}
            pageSizeSelectionOptions={pageSizeOptions}
            />
        }
      >
        <FlatTableHead>
          <FlatTableRow>
            <FlatTableHeader>Title</FlatTableHeader>
            <FlatTableHeader>Details</FlatTableHeader>
            <FlatTableHeader>Assigned To</FlatTableHeader>
            <FlatTableHeader>Status Text</FlatTableHeader>
            <FlatTableHeader />
          </FlatTableRow>
        </FlatTableHead>
        <FlatTableBody>
          {renderRows()}
        </FlatTableBody>
      </FlatTable>
    </div>
  )
}

export default IssueTable

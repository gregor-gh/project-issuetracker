import React from 'react'
import NavigationBar from "carbon-react/lib/components/navigation-bar"
import Box from "carbon-react/lib/components/box"
//import VerticalDivider from "carbon-react/lib/components/vertical-divider";
//import Icon from "carbon-react/lib/components/icon"
import {
  Menu,
  MenuItem,
  //SubmenuBlock,
  //MenuDivider,
} from "carbon-react/lib/components/menu";

// top navbar including the Issue Tracker title and the Add issue button
const NavBar = ({ addIssueOpen, setAddIssueOpen, setAddOrUpdate, setEditInitVals }) => {
  return (
    <NavigationBar id="nav-bar" navigationType="dark" >
      <Box display="flex" flex="1" margin="0 auto">
        <Menu menuType="dark" display="flex" flex="1">
          <Box height="" flex="1">
              Issue Tracker
          </Box>
          <MenuItem icon="add" onClick={() => {
              setAddIssueOpen(!addIssueOpen)
              setEditInitVals({ // reset edit initial values to as not to pull through the values from the last edit
                _id: "",
                title: "",
                details: "",
                assigned: "",
                status: ""
              })
              setAddOrUpdate("Add")
              }}>
            Add Issue
          </MenuItem>
        </Menu>
      </Box>
    </NavigationBar>

  )
}

export default NavBar

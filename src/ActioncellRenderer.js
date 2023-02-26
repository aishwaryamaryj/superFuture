import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  MoreVert,
  NoteAdd,
  Update,
  Delete,
  ViewList,
} from "@mui/icons-material";
const ActioncellRenderer = (props) => {
  const {
    setTrigeredAction,
    setOpenDialog,
    setSelectedCustomer,
    setCustomerId,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const rowEditOrViewAction = (preferedAction) => {
    if (preferedAction === "edit" || preferedAction === "view") {
      const selectedValue = [];
      selectedValue.push(props.params.data);
      setSelectedCustomer([...selectedValue]);
    }
    setTrigeredAction(preferedAction);
    setOpenDialog(true);
  };

  const deleteAction = () => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${props.params.data.id}`)
      .then((resp) => resp.json())
      .then((data) => setCustomerId(data.id));
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        style={{ padding: 0 }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            rowEditOrViewAction("view");
          }}
        >
          <ListItemIcon>
            <ViewList fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            rowEditOrViewAction("create");
          }}
        >
          <ListItemIcon>
            <NoteAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            rowEditOrViewAction("edit");
          }}
        >
          <ListItemIcon>
            <Update fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTrigeredAction("delete");
            deleteAction();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActioncellRenderer;

import React, { useCallback, useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ContactDetailRenderer from "./ContactDetailRenderer";
import ActioncellRenderer from "./ActioncellRenderer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./App.css";

const App = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [trigeredAction, setTrigeredAction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [customerId, setCustomerId] = useState();
  let updatedData = [];

  const handleClose = () => {
    setOpenDialog(false);
    updatedData = [];
    setSelectedCustomer([]);
    setTrigeredAction("");
  };

  useEffect(() => {
    trigeredAction === "delete" && deleteAnEntry(customerId);
  }, [customerId]);

  const onGridReady = useCallback((params) => {
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=0`)
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const deleteAnEntry = (userId) => {
    const rowValue = [...rowData];
    let index = rowValue.findIndex((item) => {
      return item.id === userId;
    });
    if (index >= 0) {
      rowValue.splice(index, 1);
      setRowData([...rowValue]);
      setTrigeredAction("");
    }
  };

  const ActionPerformComponent = (params) => {
    return (
      <ActioncellRenderer
        params={params}
        setRowData={setRowData}
        setSelectedCustomer={setSelectedCustomer}
        setCustomerId={setCustomerId}
        deleteAnEntry={deleteAnEntry}
        setOpenDialog={setOpenDialog}
        rowData={rowData}
        setTrigeredAction={setTrigeredAction}
      />
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      value: "Id",
      field: "id",
      width: 100,
      cellRenderer: ContactDetailRenderer,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }),
    },
    {
      value: "User Id",
      field: "userId",
      width: 100,
      cellRenderer: ContactDetailRenderer,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }),
    },
    {
      value: "Title",
      field: "title",
      flex: 1,
      cellRenderer: ContactDetailRenderer,
      wrapText: true,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }),
    },
    {
      value: "Body",
      field: "body",
      flex: 2,
      cellRenderer: ContactDetailRenderer,
      wrapText: true,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }),
    },
    {
      width: 50,
      cellRenderer: ActionPerformComponent,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }),
    },
  ]);

  const viewColumnDefs = [
    {
      value: "Id",
      field: "id",
      width: 100,
      cellRenderer: ContactDetailRenderer,
    },
    {
      value: "User Id",
      field: "userId",
      width: 100,
      cellRenderer: ContactDetailRenderer,
    },
    {
      value: "Title",
      field: "title",
      flex: 1,
      wrapText: true,
      cellRenderer: ContactDetailRenderer,
    },
    {
      value: "Body",
      field: "body",
      flex: 2,
      wrapText: true,
      cellRenderer: ContactDetailRenderer,
    },
  ];

  const editChangeHandler = (event) => {
    const valueEdited =
      trigeredAction === "create"
        ? selectedCustomer.length > 0
          ? selectedCustomer[0]
          : {}
        : selectedCustomer[0];
    valueEdited[event.target.id] = event.target.value;
    updatedData[0] = valueEdited;
    trigeredAction === "create"
      ? setSelectedCustomer(updatedData)
      : setCustomerId(selectedCustomer[0].id);
  };

  const addNewPost = () => {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: selectedCustomer[0].title,
        body: selectedCustomer[0].body,
        userId: selectedCustomer[0].userId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const createdData = [];
        createdData.push(json);
        const rowValue = [...rowData];
        const valueEdited = createdData[0];
        rowValue.push(valueEdited);
        setRowData([...rowValue]);
        setOpenDialog(false);
        setSelectedCustomer([]);
        setTrigeredAction("");
      });
  };

  const updateEditedData = () => {
    fetch(
      `https://jsonplaceholder.typicode.com/posts/${selectedCustomer[0].id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: updatedData[0].title,
          body: updatedData[0].body,
          userId: updatedData[0].userId,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setCustomerId(selectedCustomer[0].id);
      });
    const rowValue = [...rowData];
    rowValue.map((value) => {
      if (value.id === selectedCustomer[0].id) {
        value.userId = updatedData[0].userId
          ? updatedData[0].userId
          : selectedCustomer[0].userId;
        value.title = updatedData[0].title
          ? updatedData[0].title
          : selectedCustomer[0].title;
        value.body = updatedData[0].body
          ? updatedData[0].body
          : selectedCustomer[0].body;
        return value;
      }
      return value;
    });
    updatedData = [];
    setRowData([...rowValue]);
    setOpenDialog(false);
    setTrigeredAction("");
  };

  return (
    <>
      <div className="companyHeaderText">Super Technologies Data Entries</div>
      <div
        className="ag-theme-alpine agGridTableStyle"
        style={{ height: "calc(100vh - 100px)", width: "calc(100wh - 100px)" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          defaultColDef={{
            suppressNavigable: true,
            autoHeight: true,
          }}
          rowHeight={60}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          onGridReady={onGridReady}
        />
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={openDialog}
          onClose={handleClose}
        >
          <DialogTitle className="dialogueTitleStyle">
            {trigeredAction === "edit" || trigeredAction === "create"
              ? "Edit Customer Details"
              : "View Customer Details"}
          </DialogTitle>
          <DialogContent>
            {trigeredAction === "edit" || trigeredAction === "create" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  border: "1px solid #babfc7",
                  borderRadius: 5,
                }}
              >
                <div
                  style={{
                    height: 320,
                    width: 500,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: "0px 0px 20px 0px",
                    }}
                  >
                    <div className="textFieldStyle">User Id</div>
                    <TextField
                      id="userId"
                      onChange={(event) => editChangeHandler(event)}
                      defaultValue={selectedCustomer[0]?.userId}
                      value={updatedData[0]?.userId}
                      label="User Id"
                      variant="outlined"
                      style={{ width: 300 }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: "0px 0px 20px 0px",
                    }}
                  >
                    <div className="textFieldStyle">Title</div>
                    <TextField
                      id="title"
                      onChange={(event) => editChangeHandler(event)}
                      defaultValue={selectedCustomer[0]?.title}
                      value={updatedData[0]?.title}
                      label="Title"
                      variant="outlined"
                      style={{ width: 300 }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: "0px 0px 20px 0px",
                    }}
                  >
                    <div className="textFieldStyle">Body</div>
                    <TextField
                      id="body"
                      onChange={(event) => editChangeHandler(event)}
                      defaultValue={selectedCustomer[0]?.body}
                      value={updatedData[0]?.body}
                      label="Body"
                      variant="outlined"
                      style={{ width: 300 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="ag-theme-alpine" style={{ height: 200 }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={selectedCustomer}
                  defaultColDef={{
                    suppressNavigable: true,
                    autoHeight: true,
                  }}
                  rowHeight={60}
                  columnDefs={viewColumnDefs}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            {trigeredAction === "edit" || trigeredAction === "create" ? (
              <>
                <Button
                  onClick={() => {
                    trigeredAction === "create"
                      ? addNewPost()
                      : updateEditedData();
                  }}
                >
                  Save
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </>
            ) : (
              <Button onClick={handleClose}>Close</Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default App;

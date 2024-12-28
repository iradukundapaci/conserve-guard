"use client";

import React, { useEffect, useState } from "react";
import {
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { DataTable } from "../Tables/Datatable";

type Group = {
  id: number;
  name: string;
  rangersCount: number;
};

export default function GroupsTable() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalGroups, setTotalGroups] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newGroup, setNewGroup] = useState<Group>({
    id: 0,
    name: "",
    rangersCount: 0,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const columns = [
    { key: "name", label: "Group Name", render: (row: Group) => row.name },
    {
      key: "rangersCount",
      label: "Rangers Count",
      render: (row: Group) => row.rangersCount,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Group) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEditGroup(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteGroup(row)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/groups", {
        params: { page: page + 1, size: rowsPerPage },
        headers: {
          accept: "application/json",
        },
      });

      // Make sure we're accessing the correct structure from the response
      const { items, meta } = response.data.payload;
      setGroups(items);
      setTotalGroups(meta.totalItems);
    } catch (error) {
      console.error("Failed to fetch groups", error);
      // Optionally add error handling UI here
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setIsEditMode(false);
    setNewGroup({
      id: 0,
      name: "",
      rangersCount: 0,
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewGroup({
      id: 0,
      name: "",
      rangersCount: 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateGroup = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/groups", newGroup, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSnackbarMessage("Group created successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
      fetchGroups();
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const handleEditGroup = (group: Group) => {
    setNewGroup(group);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateGroup = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/groups/${newGroup.id}`,
        { name: newGroup.name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setSnackbarMessage("Group updated successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
      fetchGroups();
    } catch (error) {
      console.error("Failed to update group", error);
    }
  };

  const handleDeleteGroup = (group: Group) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/groups/${groupToDelete?.id}`,
      );
      setSnackbarMessage("Group deleted successfully!");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
      fetchGroups();
    } catch (error) {
      console.error("Failed to delete group", error);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleOpenModal}
        >
          Add Group
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={groups}
        count={totalGroups}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditMode ? "Edit Group" : "Create Group"}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Group Name"
            fullWidth
            margin="dense"
            value={newGroup.name}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={isEditMode ? handleUpdateGroup : handleCreateGroup}
            variant="contained"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {groupToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteGroup}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

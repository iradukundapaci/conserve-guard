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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { DataTable } from "../Tables/Datatable";

export enum UserRole {
  ADMIN = "ADMIN",
  SENIOR_RANGER = "SENIOR_RANGER",
  RANGER = "RANGER",
}

type User = {
  id: number;
  email: string;
  names: string;
  role: UserRole;
  password?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    email: "",
    names: "",
    role: UserRole.RANGER, // Default role
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const columns = [
    { key: "names", label: "Name", render: (row: User) => row.names },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "actions",
      label: "Actions",
      render: (row: User) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEditUser(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteUser(row)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const getToken = () => localStorage.getItem("accessToken") || "";

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/users", {
        params: { page: page + 1, size: rowsPerPage },
        headers: {
          accept: "application/json",
        },
      });

      const { items, meta } = response.data.payload;
      const allUsers = items.map((user: any) => ({
        id: user.id,
        email: user.email,
        names: user.names,
        role: user.role,
      }));

      setUsers(allUsers);
      setTotalUsers(meta.totalItems);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
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
    setNewUser({
      id: 0,
      email: "",
      names: "",
      role: UserRole.RANGER,
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewUser({
      id: 0,
      email: "",
      names: "",
      role: UserRole.RANGER,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: any) => {
    setNewUser((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const handleCreateUser = async () => {
    try {
      await axios.post("http://localhost:8000/api/v1/users", newUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setSnackbarMessage("User created successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
      fetchUsers(); // Refetch users after creation
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  const handleEditUser = (user: User) => {
    // Only set name and role for editing
    setNewUser({
      id: user.id,
      email: user.email,
      names: user.names,
      role: user.role,
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/users/${newUser.id}`,
        {
          names: newUser.names,
          role: newUser.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("User updated successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/users/${userToDelete?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("User deleted successfully!");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
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
          Add User
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={users}
        count={totalUsers}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditMode ? "Edit User" : "Create User"}</DialogTitle>
        <DialogContent>
          {!isEditMode && (
            <>
              <TextField
                name="email"
                label="Email"
                fullWidth
                margin="dense"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="dense"
                value={newUser.password || ""}
                onChange={handleInputChange}
              />
            </>
          )}
          <TextField
            name="names"
            label="Name"
            fullWidth
            margin="dense"
            value={newUser.names}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              label="Role"
              onChange={handleRoleChange}
            >
              {Object.values(UserRole).map((role) => (
                <MenuItem key={role} value={role}>
                  {role.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={isEditMode ? handleUpdateUser : handleCreateUser}
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
          Are you sure you want to delete {userToDelete?.names}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteUser} color="error" variant="contained">
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

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

type User = {
  id: number;
  email: string;
  names: string;
  role: string;
  profileImage: string | null;
  password: string;
};

type PageProps = {
  role: string;
};

export default function UsersPage({ role }: PageProps) {
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
    role: role,
    profileImage: null,
    password: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const columns = [
    { key: "names", label: "Name", render: (row: User) => row.names },
    { key: "email", label: "Email" },
    {
      key: "profileImage",
      label: "Profile Image",
      render: (row: User) =>
        row.profileImage ? (
          <img
            src={row.profileImage}
            alt={`${row.names}'s profile`}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          "No Image"
        ),
    },
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users", {
          params: { role, page: page + 1, size: rowsPerPage },
          headers: {
            accept: "application/json",
          },
        });

        const { items, meta } = response.data.payload;
        const allUsers = items.map((user: any) => ({
          id: user.id,
          email: user.email,
          names: user.profile.names,
          role: user.profile.role,
          profileImage: user.profile.profileImage,
        }));

        setUsers(allUsers);
        setTotalUsers(meta.totalItems);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage, role]);

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
      role,
      profileImage: null,
      password: "",
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewUser({
      id: 0,
      email: "",
      names: "",
      role,
      profileImage: null,
      password: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
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
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  const handleEditUser = (user: User) => {
    setNewUser(user);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/users/${newUser.id}`,
        newUser,
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
          Add {role}
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

      {/* Create/Edit User Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditMode ? "Edit User" : "Create User"}</DialogTitle>
        <DialogContent>
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="dense"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <TextField
            name="names"
            label="Name"
            fullWidth
            margin="dense"
            value={newUser.names}
            onChange={handleInputChange}
          />
          <TextField
            name="profileImage"
            label="Profile Image URL"
            fullWidth
            margin="dense"
            value={newUser.profileImage || ""}
            onChange={handleInputChange}
          />
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

      {/* Delete Confirmation Dialog */}
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

      {/* Snackbar */}
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

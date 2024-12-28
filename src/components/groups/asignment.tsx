"use client";

import React, { useEffect, useState } from "react";
import {
  Stack,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemIcon,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";

type User = {
  id: number;
  names: string;
};

type Group = {
  id: number;
  name: string;
};

export default function AssignUsersToGroups() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchUsersAndGroups = async () => {
    setLoading(true);
    try {
      const [usersResponse, groupsResponse] = await Promise.all([
        axios.get(
          `${process.env.API_URL}/api/v1/users?role=RANGER&hasNoGroup=true`,
        ),
        axios.get(`${process.env.API_URL}/api/v1/groups`),
      ]);
      setUsers(usersResponse.data.payload.items);
      setGroups(groupsResponse.data.payload.items);
    } catch (error) {
      console.error("Error fetching users or groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndGroups();
  }, []);

  const handleGroupChange = (event: SelectChangeEvent<number>) => {
    setSelectedGroup(Number(event.target.value));
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAssignUsers = async () => {
    if (!selectedGroup) {
      setSnackbarMessage("Please select a group.");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8000/api/v1/groups/${selectedGroup}/assign-users`,
        { userIds: selectedUsers },
        { headers: { "Content-Type": "application/json" } },
      );
      setSnackbarMessage("Users successfully assigned to the group!");
      setSnackbarOpen(true);
      fetchUsersAndGroups();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error assigning users to group:", error);
      setSnackbarMessage("Failed to assign users to the group.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Assign Users to Groups</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Select
            value={selectedGroup || ""}
            onChange={handleGroupChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a group
            </MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>

          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => toggleUserSelection(user.id)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedUsers.includes(user.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={user.names} />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignUsers}
            disabled={loading || !selectedGroup || selectedUsers.length === 0}
          >
            Assign Users
          </Button>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

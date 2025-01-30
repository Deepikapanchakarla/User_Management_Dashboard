import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", department: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from JSONPlaceholder API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      const formattedUsers = response.data.map((user) => ({
        id: user.id,
        firstName: user.name.split(" ")[0] || "",
        lastName: user.name.split(" ")[1] || "",
        email: user.email,
        department: user.company?.name || "N/A",
      }));
      setUsers(formattedUsers);
    } catch (error) {
      setError("Failed to fetch users");
    }
  };

  // Form validation
  const validateForm = () => {
    if (!newUser.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!newUser.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!newUser.email.trim() || !/^\S+@\S+\.\S+$/.test(newUser.email)) {
      setError("A valid email is required");
      return false;
    }
    if (!newUser.department.trim()) {
      setError("Department is required");
      return false;
    }
    setError(null);
    return true;
  };  

  // Add a new user (POST request)
  const addUser = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", newUser);//sending request to backend to add new user
      const newUserWithId = { ...newUser, id: response.data.id || users.length + 1 };
      setUsers([...users, newUserWithId]);
      setNewUser({ firstName: "", lastName: "", email: "", department: "" });
    } catch (error) {
      setError("Failed to add user");
    }
  };

  // Edit user
  const editUser = (user) => {
    setEditingUser(user);
    setNewUser({ firstName: user.firstName, lastName: user.lastName, email: user.email, department: user.department });
  };

  // Update user (PUT request)
  const updateUser = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, newUser);//sending request to backend to edit
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...newUser } : user)));
      setEditingUser(null);
      setNewUser({ firstName: "", lastName: "", email: "", department: "" });
    } catch (error) {
      setError("Failed to update user");
    }
  };

  // Delete user (DELETE request)
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);//sending request to backend to delete
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="container">
      <h1>User Management</h1>
      {error && <p className="error">{error}</p>}

      <div className="form-container">
        <input type="text" placeholder="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
        <input type="text" placeholder="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input type="text" placeholder="Department" value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} />
        {editingUser ? <button onClick={updateUser}>Update User</button> : <button onClick={addUser}>Add User</button>}
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <button onClick={() => editUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(Math.ceil(users.length / usersPerPage))].map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
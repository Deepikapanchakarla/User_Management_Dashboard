import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  // State to store users data
  const [users, setUsers] = useState([]);
  // State to store error message
  const [error, setError] = useState(null);
  // State to store form data for new or editing user
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", department: "" });
  // State to track the user being edited
  const [editingUser, setEditingUser] = useState(null);
  // State for pagination (current page number)
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Number of users per page for pagination

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
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
      setUsers(formattedUsers); // Update state with formatted user data
    } catch (error) {
      setError("Failed to fetch users"); // Handle error if API request fails
    }
  };

  // Form validation before adding or updating a user
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
    setError(null); // Reset error if validation passes
    return true;
  };

  // Add a new user
  const addUser = () => {
    if (!validateForm()) return; // Check form validity before proceeding
    const newUserWithId = {
      ...newUser,
      id: users.length ? users[users.length - 1].id + 1 : 1, // Generate a unique ID for the new user
    };
    setUsers([...users, newUserWithId]); // Update users list with the new user
    setNewUser({ firstName: "", lastName: "", email: "", department: "" }); // Reset form fields
  };

  // Edit an existing user
  const editUser = (user) => {
    setEditingUser(user); // Set the user being edited
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
    });
  };

  // Update user details
  const updateUser = () => {
    if (!validateForm()) return; // Check form validity before updating
    setUsers(
      users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              department: newUser.department,
            }
          : user
      )
    );
    setEditingUser(null); // Reset editing state
    setNewUser({ firstName: "", lastName: "", email: "", department: "" }); // Reset form fields
  };

  // Delete a user
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id)); // Filter out the deleted user from the list
  };

  // Handle pagination (set the current page)
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Slice the users array based on the current page
  const currentUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="container">
      <h1 className="title">User Management</h1>
      {error && <p className="error">{error}</p>} {/* Display error message if any */}

      <div className="form-container">
        <input
          type="text"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          value={newUser.department}
          onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
        />
        {editingUser ? (
          <button onClick={updateUser}>Update User</button> // Update user button
        ) : (
          <button onClick={addUser}>Add User</button> // Add new user button
        )}
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
          <button
            key={index}
            onClick={() => paginate(index + 1)} // Navigate to page number
            className={currentPage === index + 1 ? "active" : ""} // Highlight active page
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;

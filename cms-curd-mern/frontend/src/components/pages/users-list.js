import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorNotice from "../misc/errorNotice";
import UserContext from "../../context/userContext";

const Users = (props) => (
  <tr>
    <td>{props.user.name}</td>
    <td>{props.user.emailaddress}</td>
    <td>{props.user.status ? 'Active' : 'Inactive'}</td>
    <td>
      <Link to={"/edituser/" + props.user._id}>edit</Link> |{" "}
      <a href="javascript:void(0);"
        onClick={() => {
          props.deleteUser(props.user._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);

function UsersList() {
  const [error, setError] = useState();
  const [users, setUsers] = useState([]);

  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    }
else{
  getUsers();
}
    
  }, []);

  const getUsers = async () => {
    axios
      .get("http://localhost:5000/users/", {
        headers: { "x-auth-token": userData.token },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        err && setError(err);
      });
  };

  const usersList = () => {
    return users.map((currentuser,index) => {
      return (
        <Users
          user={currentuser}
          deleteUser={deleteUsers}
          key={currentuser._id}
        />
      );
    });
  };

  const deleteUsers = (id) => {
    axios
      .delete("http://localhost:5000/users/" + id, {
        headers: { "x-auth-token": userData.token },
      })
      .then((response) => {
        setError(response.data);
      });

    setUsers(users.filter((el) => el._id !== id));
  };

  return (
    <div className="container">
      <h4>User List</h4>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Emailaddress</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0
            ? usersList()
            : ""}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;

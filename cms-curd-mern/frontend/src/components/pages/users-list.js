import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorNotice from "../misc/errorNotice";

const Users = props => (
  <tr>
    <td>{props.user.name}</td>
    <td>{props.user.emailaddress}</td>
    <td>{props.user.status}</td>
    <td>
      <Link to={"/edit/"+props.user._id}>edit</Link> | <a href="#" onClick={() => { props.deleteUser(props.user._id) }}>delete</a>
    </td>
  </tr>
)

class UsersList extends Component {
  constructor(props) {
    super(props);

    this.deleteUsers = this.deleteUsers.bind(this);

    this.state = {users: []};
  }

  componentDidMount() {
    axios.get('http://localhost:5000/users/')
      .then(response => {
        this.setState({ users: response.data })
      })
      .catch((error) => {
        this.ErrorNotice.setError(error);
      })
  }

  deleteUsers(id) {
    axios.delete('http://localhost:5000/users/'+id)
      .then(response => { this.ErrorNotice.setError(response.data)});

    this.setState({
        users: this.state.users.filter(el => el._id !== id)
    })
  }

  usersList() {
    return this.state.users.map(currentuser => {
      return <Users user={currentuser} deleteUser={this.deleteUsers} key={currentuser._id}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>User List</h3>
        
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
            { this.usersList() }
          </tbody>
        </table>
      </div>
    )
  }


}

export default UsersList;
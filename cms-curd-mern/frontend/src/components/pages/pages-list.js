import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorNotice from "../misc/errorNotice";
import UserContext from "../../context/userContext";

const Pages = (props) => (
  <tr>
    <td>{props.page.title}</td>
    <td>{props.page.content}</td>
    <td>{props.page.keywords.map((keyword)=>{
       return (
        <span className="react-tagsinput-tag">
          {keyword}
        </span>
      );
    })}</td>
    <td>
      <Link to={"/editpage/" + props.page._id}>edit</Link> |{" "}
      <a href="javascript:void(0);"
        onClick={() => {
          props.deletePage(props.page._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);

function PagesList() {
  const [error, setError] = useState();
  const [pages, setPages] = useState([]);

  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    alert(userData.user)
    if (!userData.user) {
      history.push("/login");
    }
    else{
      getPages();
    }

    
  }, []);

  const getPages = async () => {
    axios
      .get("http://localhost:5000/pages/", {
        headers: { "x-auth-token": userData.token },
      })
      .then((response) => {
        setPages(response.data);
      })
      .catch((err) => {
        err && setError(err);
      });
  };

  const pagesList = () => {
    return pages.map((currentpage) => {
      return (
        <Pages
          page={currentpage}
          deletePage={deletePages}
          key={currentpage._id}
        />
      );
    });
  };

  const deletePages = (id) => {
    axios
      .delete("http://localhost:5000/pages/" + id, {
        headers: { "x-auth-token": userData.token },
      })
      .then((response) => {
        setError(response.data);
      });

    setPages(pages.filter((el) => el._id !== id));
  };

  return (
    <div className="container">
      <h4>Page List</h4>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Keywords</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.length > 0
            ? pagesList()
            : ""}
        </tbody>
      </table>
    </div>
  );
}

export default PagesList;

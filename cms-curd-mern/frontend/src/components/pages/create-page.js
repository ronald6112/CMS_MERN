import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../misc/errorNotice";

function CreatePage(props) {
  const [id, setId] = useState(props.match.params.id);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [keywords, setKeywords] = useState({});
  const [error, setError] = useState();
  const { userData } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    }
    createOrEditPage();
  }, []);

  const createOrEditPage = async () => {
    if (id) {
      axios
        .get("http://localhost:5000/pages/" + id, {
          headers: { "x-auth-token": userData.token },
        })
        .then((response) => {
          if (response) {
            setTitle(response.data.title);
            setContent(response.data.content);
            setKeywords(response.data.keywords);
          }
        })
        .catch((err) => {
          err && setError(err);
        });
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newPage = {
        title,
        content,
        keywords,
        createdBy: userData.user.id,
      };
      if (id) {
        await axios.post("http://localhost:5000/pages/update/" + id, newPage, {
          headers: { "x-auth-token": userData.token },
        });
      } else {
        await axios.post("http://localhost:5000/pages/add", newPage, {
          headers: { "x-auth-token": userData.token },
        });
      }

      history.push("/pages");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="container">
      <h2> {id ? "Update Page" : "Create Page"}</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="name">Title </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            className="form-control"
            placeholder="Enter Content"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Keywords</label>
        </div>
        <button type="submit" className="btn btn-primary cmscolor">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreatePage;

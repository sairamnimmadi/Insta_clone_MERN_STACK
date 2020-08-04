import React, { useState, useEffect, useContext } from "react";

import { useHistory } from "react-router-dom";

import M from "materialize-css";
import { UserContext } from "../../App";

const CreatePost = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  // console.log(state);
  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
          profilepic: state.pic,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#f44336 red" });
          } else {
            M.toast({ html: "Posted Successfully", classes: "#4caf50 green" });
            console.log(data);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  // console.log(state);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Insta-Clone");
    data.append("cloud_name", "cloneinsta");
    fetch("https://api.cloudinary.com/v1_1/cloneinsta/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err));
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Create Post</h2>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>
              <h6 style={{ paddingTop: "5%" }}>Updload Image</h6>
            </span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1 col-5 col-md-4 offset-md-4 offset-3"
          onClick={() => postDetails()}
        >
          SUBMIT POST
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

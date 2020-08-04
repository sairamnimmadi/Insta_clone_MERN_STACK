import React, { useState, useEffect, useContext } from "react";

import { Link, useHistory } from "react-router-dom";

import M from "materialize-css";
import { UserContext } from "../../App";

var deflink =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTjA0Lpsg840JNGLaPgVWM9QofkvAYdFPLb-g&usqp=CAU";

const EditProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [name, setName] = useState(state && state.name);
  const [image, setImage] = useState(undefined);

  // console.log(state);
  var publicId = "";
  if (state && state.pic !== deflink) {
    publicId = JSON.parse(localStorage.getItem("user"))
      .pic.split("/")[7]
      .split(".")[0];
  }
  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadProfilePic = () => {
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

  const uploadFields = () => {
    if (name && name.length > 0 && name.length < 5) {
      M.toast({
        html: "Name must be more than 5 Charcters",
        classes: "#f44336 red",
      });
      return;
    }
    // console.log(state);
    fetch("/editprofile", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name: name ? name : state.name,
        pic: url ? url : state.pic,
        oldpic: state.pic,
        publicId: publicId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
          M.toast({ html: "Updated Successfully", classes: "#4caf50 green" });
          history.push("/profile");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, name: data.name, pic: data.pic }),
          );
          dispatch({ type: "UPDATEPROFILE", payload: data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const PostData = () => {
    if (image) {
      uploadProfilePic();
    } else {
      uploadFields();
    }
  };
  return (
    <div className="mycard" onSubmit={(e) => (e.target.value = "")}>
      <div className="card auth-card input-field">
        <h2>Edit Profile</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>
              <h6 style={{ paddingTop: "5%" }}>Updload Profile pic</h6>
            </span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1 col-3 offset-4"
          onClick={() => PostData()}
        >
          Edit
        </button>
        <div style={{ marginTop: "5%" }}>
          <h5>
            <Link to="/signin">Go to Home ?</Link>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

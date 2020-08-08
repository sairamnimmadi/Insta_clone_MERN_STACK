import React, { useState, useEffect, useContext } from "react";

import { Link, useHistory } from "react-router-dom";

import M from "materialize-css";
import { UserContext } from "../../App";
import { Online, Offline } from "react-detect-offline";
import Nonet from "./Offline";
import ReactTooltip from "react-tooltip";

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
    <>
      <Online>
        <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Edit Profile</h2>
            <img
              data-tip="click on camera to change profile pic"
              className="offset-2 offset-md-3"
              src={state && state.pic}
              alt=""
              style={{
                height: "200px",
                width: "200px",
                objectFit: "cover",
                borderRadius: "200px",
              }}
            />
            <span className="file-field validate">
              <i className="small material-icons">add_a_photo</i>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </span>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-1 col-3 offset-4 mt-4"
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
          <ReactTooltip />
        </div>
      </Online>
      <Offline>
        <Nonet />
      </Offline>
    </>
  );
};

export default EditProfile;

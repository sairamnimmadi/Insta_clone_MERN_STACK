import React, { useState, useEffect } from "react";

import { Link, useHistory } from "react-router-dom";

import M from "materialize-css";

import { Offline, Online } from "react-detect-offline";
import Nonet from "./Offline";

var reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const [showpassword, setshowPassword] = useState(false);
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
    if (!reg_email.test(email) && name.length > 0 && name.length < 5) {
      M.toast({
        html: "Invalid email,Name must be greater than 5 characters",
        classes: "#f44336 red",
      });
      return;
    } else if (!reg_email.test(email)) {
      M.toast({ html: "Invalid email ", classes: "#f44336 red" });
      return;
    } else if (name.length > 0 && name.length < 5) {
      M.toast({
        html: "Name must be more than 5 Charcters",
        classes: "#f44336 red",
      });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
          M.toast({ html: data.message, classes: "#4caf50 green" });
          history.push("/signin");
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
            <h2>Signup</h2>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="row">
              <div className="col-10">
                <input
                  type={showpassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="col-2">
                {!showpassword ? (
                  <i
                    className="fa fa-eye-slash"
                    style={{
                      fontSize: "150%",
                      marginTop: "26px",
                      cursor: "pointer",
                    }}
                    onClick={() => setshowPassword(true)}
                  ></i>
                ) : (
                  <i
                    className="fa fa-eye"
                    style={{
                      fontSize: "150%",
                      marginTop: "26px",
                      cursor: "pointer",
                    }}
                    onClick={() => setshowPassword(false)}
                  ></i>
                )}
              </div>
            </div>
            <div className="file-field input-field">
              <div className="btn #64b5f6 blue darken-1">
                <span>
                  <h6 style={{ paddingTop: "5%" }}>Updload Profile pic</h6>
                </span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-1 col-3 offset-4"
              onClick={() => PostData()}
            >
              SignUp
            </button>
            <div style={{ marginTop: "5%" }}>
              <h5>
                <Link to="/signin">Already have an account ?</Link>
              </h5>
            </div>
          </div>
        </div>
      </Online>
      <Offline>
        <Nonet />
      </Offline>
    </>
  );
};

export default Signup;

import React, { useState, useContext } from "react";

import { useHistory } from "react-router-dom";

import M from "materialize-css";

import { Offline, Online } from "react-detect-offline";
import Nonet from "./Offline";

var reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const PostData = () => {
    if (!reg_email.test(email)) {
      M.toast({
        html: "Invalid email,Name must be greater than 5 characters",
        classes: "#f44336 red",
      });
      return;
    }
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
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
  return (
    <>
      <Online>
        <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Reset Password</h2>
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-1 col-4 offset-4 mt-3"
              style={{ borderRadius: "25px" }}
              onClick={() => PostData()}
            >
              Reset Password
            </button>
            <div style={{ marginTop: "5%" }}></div>
          </div>
        </div>
      </Online>
      <Offline>
        <Nonet />
      </Offline>
    </>
  );
};

export default Reset;

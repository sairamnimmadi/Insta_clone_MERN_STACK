import React, { useState, useContext } from "react";

import { useHistory, useParams } from "react-router-dom";

import M from "materialize-css";

import { Offline, Online } from "react-detect-offline";
import Nonet from "./Offline";

const Activate = () => {
  const history = useHistory();
  const { token } = useParams();
  console.log(token);
  const PostData = () => {
    fetch("/activate", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
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
  return (
    <>
      <Online>
        <div className="mycard">
          <div className="card auth-card input-field">
            <h2>Activate your Account</h2>
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-1 col-5 offset-4 mt-3"
              style={{ borderRadius: "25px" }}
              onClick={() => PostData()}
            >
              Activate
            </button>
          </div>
        </div>
      </Online>
      <Offline>
        <Nonet />
      </Offline>
    </>
  );
};

export default Activate;

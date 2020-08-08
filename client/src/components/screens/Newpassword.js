import React, { useState, useContext } from "react";

import { useHistory, useParams } from "react-router-dom";

import M from "materialize-css";

import { Offline, Online } from "react-detect-offline";
import Nonet from "./Offline";

const Newpassword = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [showpassword, setshowPassword] = useState(false);
  const { token } = useParams();
  // console.log(token);
  const PostData = () => {
    if (password != repassword) {
      M.toast({
        html: "The two entered passwords must be same",
        classes: "#f44336 red",
      });
      return;
    }
    fetch("/newpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
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
            <h2>Update Password</h2>
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
            <input
              type="password"
              placeholder="Re-Enter new password"
              value={repassword}
              onChange={(e) => setrePassword(e.target.value)}
            />
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-1 col-4 offset-4 mt-3"
              style={{ borderRadius: "25px" }}
              onClick={() => PostData()}
            >
              Update Password
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

export default Newpassword;

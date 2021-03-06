import React, { useState, useContext, useEffect } from "react";

import { Link, useHistory } from "react-router-dom";

import M from "materialize-css";
import { UserContext } from "../../App";

import { Offline, Online } from "react-detect-offline";
import Nonet from "./Offline";

var reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SignIn = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showpassword, setshowPassword] = useState(false);
  // useEffect(() => {
  //   setshowPassword(false);
  // }, [showpassword]);
  const PostData = () => {
    if (!reg_email.test(email)) {
      M.toast({
        html: "Invalid email,Name must be greater than 5 characters",
        classes: "#f44336 red",
      });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#f44336 red" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "Signed In Successfully", classes: "#4caf50 green" });
          history.push("/");
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
            <h2>Login</h2>
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
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-1 col-3 offset-4 mt-3"
              onClick={() => PostData()}
            >
              Login
            </button>
            <div style={{ marginTop: "5%" }} className="row">
              <h6 className="col">
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", fontSize: "100%" }}
                >
                  Don't have an account ?
                </Link>
              </h6>
              <h6 className="col">
                <Link
                  to="/reset"
                  style={{ textDecoration: "none", fontSize: "100%" }}
                >
                  Forgot Password ?
                </Link>
              </h6>
            </div>
            <div>
              <h6>
                <Link
                  to="/activate"
                  style={{ textDecoration: "none", fontSize: "100%" }}
                >
                  Activate account ?
                </Link>
              </h6>
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

export default SignIn;

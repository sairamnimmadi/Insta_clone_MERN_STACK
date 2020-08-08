import React, { useContext, useRef, useEffect, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import ReactTooltip from "react-tooltip";
import M from "materialize-css";
import { Offline, Online } from "react-detect-offline";

const NavBar = () => {
  const searchModal = useRef(null);
  const { state, dispatch } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState([]);
  const [search, setSearch] = useState("");

  const history = useHistory();

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="10">
          <Link to={state ? "/" : "/signin"} className="sidenav-close">
            <i
              data-tip="Home"
              className="fa fa-home"
              style={{ fontSize: "160%" }}
            ></i>
          </Link>
        </li>,

        <li key="9" className="sidenav-close">
          <Link>
            <i
              data-target="modal1"
              data-tip="search users"
              className="modal-trigger fa fa-search"
              style={{ fontSize: "150%" }}
            ></i>
          </Link>
        </li>,
        <li key="2">
          <Link to="/create" className="sidenav-close">
            <i
              data-tip="create post"
              className="fa fa-plus-square-o"
              style={{ fontSize: "160%" }}
            ></i>
          </Link>
        </li>,
        <li key="1">
          <Link to="/profile" className="sidenav-close">
            <img
              className="set"
              data-tip="edit profile"
              src={state && state.pic}
              style={{
                height: "28px",
                width: "28px",
                borderRadius: "14px",
                objectFit: "cover",
              }}
            />
          </Link>
        </li>,

        <li key="3">
          <Link to="/showsavedposts" className="sidenav-close">
            <i
              data-tip="saved posts"
              className="fa fa-save"
              style={{ fontSize: "150%" }}
            ></i>
          </Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingposts" className="sidenav-close">
            <span
              class="fa-stack stack"
              data-tip="My following posts"
              style={{ fontSize: "93%" }}
            >
              <i class="fa fa-users fa-stack-1x"></i>
              <i class="fa fa-sticky-note-o fa-stack-2x"></i>
            </span>
          </Link>
        </li>,
        <li key="5">
          <Link to="/editprofile" className="sidenav-close">
            <i
              data-tip="edit profile"
              className="fa fa-cog"
              style={{ fontSize: "150%" }}
            ></i>
          </Link>
        </li>,
        <li key="6">
          <button
            type="button"
            data-tip="Log Out"
            className="btn btn-danger setlog"
            style={{ borderRadius: "10px" }}
            onClick={() => {
              localStorage.removeItem("jwt");
              localStorage.removeItem("user");
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            <span>
              <i
                className="fa fa-sign-out logout"
                style={{ fontSize: "150%" }}
              ></i>
            </span>
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="7">
          <Link to="/signin" className="sidenav-close">
            Login
          </Link>
        </li>,
        <li key="8">
          <Link to="/signup" className="sidenav-close">
            Signup
          </Link>
        </li>,
      ];
    }
  };
  const dupList = () => {
    if (state) {
      return [
        <li key="10">
          <Link to={state ? "/" : "/signin"} className="sidenav-close">
            <i
              data-tip="Home"
              className="fa fa-home"
              style={{ fontSize: "160%" }}
            ></i>
            <span style={{ marginLeft: "-20px" }}>Home</span>
          </Link>
        </li>,

        <li key="9" className="sidenav-close">
          <Link>
            <i
              data-target="modal1"
              data-tip="search users"
              className="modal-trigger fa fa-search"
              style={{ fontSize: "150%" }}
            ></i>
            <span style={{ marginLeft: "-20px" }}>Search</span>
          </Link>
        </li>,

        <li key="2">
          <Link to="/create" className="sidenav-close">
            <i
              data-tip="create post"
              className="fa fa-plus-square-o"
              style={{ fontSize: "160%" }}
            ></i>
            <span style={{ marginLeft: "-20px" }}>Create Post</span>
          </Link>
        </li>,
        <li key="1">
          <Link to="/profile" className="sidenav-close">
            <img
              className="set"
              data-tip="edit profile"
              src={state && state.pic}
              style={{
                height: "28px",
                width: "28px",
                borderRadius: "14px",
                objectFit: "cover",
              }}
            />
            <span style={{ marginLeft: "15px" }}>Profile</span>
          </Link>
        </li>,
        <li key="3">
          <Link to="/showsavedposts" className="sidenav-close">
            <i
              data-tip="saved posts"
              className="fa fa-save"
              style={{ fontSize: "150%" }}
            ></i>
            <span style={{ marginLeft: "-20px" }}>Saved Posts</span>
          </Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingposts" className="sidenav-close">
            <span
              class="fa-stack stack"
              data-tip="My following posts"
              style={{ fontSize: "93%" }}
            >
              <i class="fa fa-users fa-stack-1x"></i>
              <i class="fa fa-sticky-note-o fa-stack-2x"></i>
            </span>
            <span style={{ marginLeft: "15px" }}>My Following Posts</span>
          </Link>
        </li>,
        <li key="5">
          <Link to="/editprofile" className="sidenav-close">
            <i
              data-tip="edit profile"
              className="fa fa-cog"
              style={{ fontSize: "150%" }}
            ></i>
            <span style={{ marginLeft: "-20px" }}>Edit Profie</span>
          </Link>
        </li>,
        <li key="6">
          <button
            type="button"
            data-tip="Log Out"
            className="btn btn-danger setlog"
            style={{ borderRadius: "10px" }}
            onClick={() => {
              localStorage.removeItem("jwt");
              localStorage.removeItem("user");
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            <i
              className="fa fa-sign-out logout"
              style={{ fontSize: "150%" }}
            ></i>
          </button>
          <span
            style={{ marginLeft: "10px", color: "black", fontWeight: "600" }}
          >
            Log Out
          </span>
        </li>,
      ];
    } else {
      return [
        <li key="7">
          <Link to="/signin" className="sidenav-close">
            Login
          </Link>
        </li>,
        <li key="8">
          <Link to="/signup" className="sidenav-close">
            Signup
          </Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    if (query === "") {
      setUserDetails([]);
      M.toast({
        html: "Search Cannot be Null",
        classes: "#f44336 red",
      });

      return;
    }
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
        console.log(results);
      });
  };
  return (
    <div>
      <nav className="white">
        <div className="nav-wrapper col-12 col-lg-8 offset-lg-2">
          <Link
            to={state ? "/" : "/signin"}
            className="brand-logo"
            style={{ textDecoration: "none" }}
          >
            Instagram
          </Link>
          <a
            href="#"
            data-target="mobile-demo"
            className="sidenav-trigger"
            style={{ float: "right" }}
          >
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">{renderList()}</ul>
        </div>
      </nav>
      <div
        id="modal1"
        className="modal modal-fixed-footer col-9 col-md-6"
        ref={searchModal}
        style={{ color: "black", height: "400px" }}
      >
        <Online>
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />

            <ul className="list-group">
              {userDetails.map((item) => {
                return (
                  <Link
                    to={
                      item._id === state._id
                        ? "/profile"
                        : "/profile/" + item._id
                    }
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                      setUserDetails([]);
                    }}
                  >
                    <a
                      class="list-group-item"
                      style={{
                        borderBottom: "1px light grey",
                        border: "none",
                      }}
                    >
                      <img
                        src={item.pic}
                        style={{
                          height: "40px",
                          width: "40px",
                          marginRight: "5%",
                          borderRadius: "20px",
                          objectFit: "cover",
                        }}
                      />
                      {item.name}
                    </a>
                  </Link>
                );
              })}
            </ul>
          </div>

          <div className="modal-footer">
            <button
              id="modclose"
              className="btn btn-danger modal-close waves-effect waves-green btn-flat"
              onClick={() => {
                setSearch("");
                setUserDetails([]);
              }}
            >
              Close
            </button>
          </div>
        </Online>
        <Offline>
          <div className="modal-content">
            <div className="offset-md-4 offset-2">
              <i class="large material-icons" style={{ fontSize: "1200%" }}>
                flight
              </i>
            </div>
            <div className="offset-md-2 offset-1">
              <i
                className="fa fa-exclamation-triangle fa-5x"
                style={{ color: "red" }}
              ></i>
              <span style={{ fontSize: "400%" }}>You are Offline</span>
            </div>
          </div>
        </Offline>
      </div>

      <ReactTooltip />
      <ul className="sidenav" id="mobile-demo">
        {dupList()}
      </ul>
    </div>
  );
};

export default NavBar;

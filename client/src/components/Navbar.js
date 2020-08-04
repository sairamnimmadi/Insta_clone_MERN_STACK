import React, { useContext } from "react";

import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();

  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/create">Create Post</Link>
        </li>,
        <li>
          <Link to="/showsavedposts">Saved Posts</Link>
        </li>,
        <>
          {state && state.following.length ? (
            <li>
              <Link to="/myfollowingposts">My Following Posts</Link>
            </li>
          ) : (
            <></>
          )}
        </>,
        <li>
          <Link to="/editprofile">Edit Profile</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #c62828 red darken-1 offset-1"
            onClick={() => {
              localStorage.removeItem("jwt");
              localStorage.removeItem("user");
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            LogOut
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
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
          <a href="#" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">{renderList()}</ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </div>
  );
};

export default NavBar;

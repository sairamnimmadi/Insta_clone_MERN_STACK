import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import NavBar from "./components/Navbar";

import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";

import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import SignIn from "./components/screens/SignIn";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/UserProfile";
import SubUserPost from "./components/screens/SubscribedUser";
import EditProfile from "./components/screens/Editprofile";
import SavedPosts from "./components/screens/SavedPosts";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingposts">
        <SubUserPost />
      </Route>
      <Route path="/editprofile">
        <EditProfile />
      </Route>
      <Route path="/showsavedposts">
        <SavedPosts />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

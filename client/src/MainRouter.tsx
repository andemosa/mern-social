import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "auth/PrivateRoute";

import Home from "core/Home";
import Menu from "core/Menu";

import Users from "user/Users";
import Signup from "user/Signup";
import Signin from "auth/Signin";
import Profile from "user/Profile";
import EditProfile from "user/EditProfile";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route
          path="/user/edit/:userId"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/user/:userId" element={<Profile />} />
        
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </div>
  );
};

export default MainRouter;

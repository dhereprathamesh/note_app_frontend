import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import UserNotes from "./userNotes/UserNotes";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./signUp/SignUp";
import SignIn from "./signIn/SignIn";
import PageNotFound from "./pageNotFound/PageNotFound";

function App() {
  return (
    <>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserNotes />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

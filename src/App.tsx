import { useState, useEffect } from "react";
import Frame from "./components/Frame";
import { Outlet } from "react-router-dom";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AppContext from "./utils/app-context";
import SignedOut from "./components/SignedOut";
import loadImg from "./assets/loading.gif";

const App = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    const unSubcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unSubcribe();
  }, []);
  return (
    <AppContext.Provider value={user}>
      <Frame>
        {user === undefined ? (
          <div className="flex flex-col gap-4 h-full items-center justify-center text-zinc-400 font-semibold text-center">
            <img src={loadImg} alt="loading" className="h-6 w-6" />
            Checking if you're signed in.
          </div>
        ) : user ? (
          <Outlet />
        ) : (
          <SignedOut />
        )}
      </Frame>
    </AppContext.Provider>
  );
};

export default App;

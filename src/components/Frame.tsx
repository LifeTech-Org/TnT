import { User } from "firebase/auth";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../utils/app-context";
import { signIn, signout } from "../utils/firebase";

const Frame = (props: {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal;
}) => {
  const user = useContext<User | null | undefined>(AppContext);

  const handleClickSignOut = () => {
    signout()
      .then((value) => {
        // console.log(value);
      })
      .catch((err) => {
        // console.log(err)
      });
  };
  return (
    <div className="bg-zinc-900 absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center">
      <div className=" w-full sm:w-80 px-8 sm:ring-1 sm:ring-gray-800 sm:p-3">
        <header className="flex items-center h-12 justify-between">
          <Link to="/">
            <h3 className="text-3xl font-bold flex gap-0.5">
              <span className="text-teal-500">T</span>
              <span className="text-amber-400">n</span>
              <span className="text-teal-500">T</span>
            </h3>
          </Link>
          {user && (
            <div
              className="w-fit h-fit p-1 rounded-full bg-zinc-800 flex cursor-pointer hover:bg-zinc-900 ring-1 ring-zinc-700"
              onClick={handleClickSignOut}
            >
              <img src={user.photoURL!} className="rounded-full h-5 w-5" />
              <span className="ml-2 text-xs text-gray-200 font-semibold">
                Sign out
              </span>
            </div>
          )}
        </header>
        <div className="h-80">{props.children}</div>
        <footer className="flex items-center h-12 text-xs font-semibold text-slate-400 justify-center">
          &copy;
          <a href="https://wa.me/+2348149120163" className="underline ml-2">
            Samuel Ayetigbo
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Frame;

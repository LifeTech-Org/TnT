import { useContext, useEffect, useState } from "react";
import TntBox from "../components/TntBox";
import { verifyMembership } from "../utils/firebase";
import { useLocation } from "react-router-dom";
import { tntProps } from "../utils/types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import AppContext from "../utils/app-context";
import { User } from "firebase/auth";
import TntEnded from "../components/TntEnded";
import { copyToClipboard } from "../utils/components";
import errorReasons from "../utils/errorReasons";
import loadImg from "../assets/loading.gif";

const Tnt = () => {
  const [loading, setIsLoading] = useState(true);
  const [listening, setListening] = useState(false);
  const { pathname } = useLocation();
  const _path = pathname.split("/tnt/")[1];
  const [tnt, setTnt] = useState<null | tntProps>(null);
  const user = useContext<User | null | undefined>(AppContext);
  const [copyStatus, setCopyStatus] = useState("Copy");

  useEffect(() => {
    verifyMembership(_path, user!)
      .then(() => {
        // setTnt(data.tnt as unknown as React.SetStateAction<null | tntProps>);

        setListening(true);
      })
      .catch(() => {
        setTnt(null);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    let unsub = () => {};
    if (listening) {
      unsub = onSnapshot(
        doc(db, "tnt", _path),
        (docRef) => {
          setTnt({
            ...docRef.data(),
            id: docRef.id,
          } as unknown as React.SetStateAction<null | tntProps>);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    }
    return () => unsub();
  }, [listening]);
  return loading ? (
    <div className="h-full flex items-center justify-center flex-col overflow-auto py-6">
      <img src={loadImg} alt="loading" className="h-6 w-6" />
    </div>
  ) : !tnt ? (
    <article className="h-full flex items-center justify-center flex-col overflow-auto py-6">
      <div className="flex justify-start w-full mt-6">
        <img
          src="https://img.icons8.com/color/96/null/broken-link.png"
          alt="broken link"
          className="h-14 w-auto"
        />
      </div>
      <h3 className="font-semibold text-white text-lg mt-2">
        Eroooorrr..... Well, it could be due to one or more from the following
        reasons:
      </h3>
      <ul className="flex flex-col gap-4 list-square text-zinc-400 ml-4 mt-6">
        {errorReasons.map((err, index) => {
          return (
            <li key={index}>
              <div className="text-xs ">{err}</div>
            </li>
          );
        })}
      </ul>
    </article>
  ) : tnt.players.length !== 2 ? (
    <div className="h-full flex items-center justify-center flex-col gap-4">
      <img
        src="https://img.icons8.com/color/96/null/conference-call--v1.png"
        alt="people"
        className="h-24 w-auto"
      />
      <span className="text-sm text-gray-300 text-center">
        Two players needed, copy and share your TnT Id to your friends and wait
        for them to join.
      </span>
      <button
        className={
          (copyStatus !== "Error" ? "border-gray-400 " : "border-red-800 ") +
          "w-full h-10 flex items-center border justify-center gap-4 rounded-sm hover:bg-zinc-800 text-gray-300 text-xs font-semibold mt-6"
        }
        onClick={() => copyToClipboard({ tntId: _path, setCopyStatus })}
      >
        {copyStatus === "Copy" ? "Copy Tnt Id" : copyStatus}
      </button>
    </div>
  ) : tnt.status === "continue" ? (
    <TntBox {...{ tnt }} />
  ) : (
    <TntEnded {...{ tnt }} />
  );
};

export default Tnt;

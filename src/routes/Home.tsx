import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { copyToClipboard, pasteClipboardText } from "../utils/components";
import { createNewTnt } from "../utils/firebase";
import AppContext from "../utils/app-context";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
const Home = () => {
  const [tab, setTab] = useState(0);
  const [tntId, setTntId] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [createStatus, setCreateStatus] = useState({
    type: "defalut",
    text: "Create",
  });
  const navigate = useNavigate();
  const user = useContext<User | null | undefined>(AppContext);

  const joinTnt = () => {
    if (tntId.length === 0) {
      return;
    }
    navigate(`tnt/${tntId}`);
  };

  const tabInfo = [
    {
      title: "Create New TnT",
      placeholder: "Click the create button to generate your Tnt Id",
      button: {
        action: () => {
          setCreateStatus({ type: "pending", text: "Working on it..." });
          createNewTnt({
            id: "",
            author: user!.uid,
            status: "continue",
            players: [user!.uid],
            timestamp: Timestamp.now(),
            sessions: [
              {
                id: 1,
                players: [{ uid: user!.uid, value: "X" }],
                status: "continue",
                plays: [...new Array(9)].map(() => null),
                turn: user!.uid,
              },
            ],
          })
            .then((_tntId) => {
              setTntId(_tntId);
              setCreateStatus({
                type: "pending",
                text: "Created Successfully.",
              });
              let remainingTime = 3;
              const intervalId = setInterval(() => {
                setCreateStatus({
                  type: "pending",
                  text: `Joining in ${remainingTime} ...`,
                });
                remainingTime--;
                if (remainingTime === -1) {
                  clearInterval(intervalId);
                  navigate(`tnt/${_tntId}`);
                }
              }, 1000);
            })
            .catch(() => {
              setCreateStatus({ type: "error", text: "Somthing went wrong" });
              setTimeout(() => {
                setCreateStatus({ type: "default", text: "Try again" });
              });
            });
        },
        text: createStatus.text,
      },
      form: {
        action: () => {
          copyToClipboard({ tntId, setCopyStatus });
        },
        text: copyStatus,
      },
    },
    {
      title: "Join a TnT with Id",
      placeholder: "Paste your Tnt Id",
      button: { action: joinTnt, text: "Join" },
      form: {
        action: () => {
          tntId.length === 0 ? pasteClipboardText({ setTntId }) : setTntId("");
        },
        text: tntId.length === 0 ? "Paste" : "Clear",
      },
    },
  ];
  const { title, placeholder, button, form } = tabInfo[tab];
  return (
    <div className="flex h-full items-center justify-center flex-col gap-6">
      <form className="flex flex-col gap-8 w-full">
        <h3 className="text-md font-semibold text-teal-500">{title}</h3>
        <div className="h-10 bg-zinc-800 w-full flex items-center rounded-sm">
          <input
            placeholder={placeholder}
            value={tntId}
            onChange={(e) => setTntId(e.target.value)}
            required={tab === 1}
            className="bg-transparent flex-1 text-sm px-2 text-zinc-300 outline-none"
            disabled
          />
          {tab === 1 && (
            <button
              type="button"
              onClick={form.action}
              className="px-3 py-1 h-fit w-fit text-zinc-300 text-xs bg-teal-700 shadow-sm rounded-sm m-2 hover:bg-teal-800"
            >
              {form.text}
            </button>
          )}
        </div>
        <button
          type={tab === 0 ? "button" : "submit"}
          onClick={(e) => {
            e.preventDefault();
            button.action();
          }}
          className={
            "border-gray-400 text-gray-300 text-xs font-semibold w-full h-10 flex items-center border justify-center gap-4 rounded-sm hover:bg-zinc-800"
          }
        >
          {button.text}
        </button>
      </form>
      <div className="flex justify-end w-full">
        <button
          onClick={() => {
            setTab((prevTab) => (prevTab === 0 ? 1 : 0));
          }}
          type="button"
          className={
            (createStatus.type !== "error"
              ? "border-gray-400 "
              : "border-red-800 ") +
            "text-teal-400 font-semibold text-sm hover:text-teal-600 w-fit"
          }
        >
          {tab === 0 ? "Join a TnT" : "Create New Tnt"}
        </button>
      </div>
    </div>
  );
};

export default Home;

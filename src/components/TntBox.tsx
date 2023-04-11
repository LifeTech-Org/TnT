import { useContext, useEffect, useState } from "react";
import { tntProps } from "../utils/types";
import AppContext from "../utils/app-context";
import { User } from "firebase/auth";
import { endTnt, playTurn, restartTnt } from "../utils/firebase";
import getTntStatus from "../utils/checkForWin";

const TntBox = ({ tnt }: { tnt: tntProps }) => {
  const user = useContext<User | null | undefined>(AppContext);
  const liveTnt = tnt.sessions[tnt.sessions.length - 1];
  const [status, setStatus] = useState(getTntStatus(tnt));
  useEffect(() => {
    setStatus(getTntStatus(tnt));
  }, [tnt]);
  return (
    <div className="h-full flex flex-col">
      <div className="h-10  flex  items-center justify-center text-4xl text-gray-200 font-semibold">
        {status.all().filter((uid) => uid === user!.uid).length}
        <span className="mx-4">:</span>
        {status.all().filter((uid) => uid !== user!.uid).length}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4 w-fit">
          {liveTnt.plays.map((value, index) => (
            <Box
              key={index}
              liveTnt={liveTnt}
              uid={user!.uid}
              value={
                !value
                  ? null
                  : liveTnt.players.find(({ uid }) => uid === value)?.value
              }
              handleClickBox={() => {
                if (
                  liveTnt.turn !== user!.uid ||
                  status.current().status !== "continue" ||
                  value
                ) {
                  return;
                }
                playTurn(user!.uid, tnt, index, liveTnt);
              }}
            />
          ))}
        </div>
      </div>
      <div className="h-10 flex items-center justify-between">
        <div className="w-fit px-3 py-1 font-semibold flex items-center rounded-full bg-zinc-800 text-gray-300 text-xs hover:bg-zinc-700 capitalize cursor-pointer">
          {status.current().status === "continue"
            ? liveTnt.turn === user!.uid
              ? "your turn"
              : "opponent's turn"
            : status.current().status === "win"
            ? status.current().winner === user!.uid
              ? "you won"
              : "opp won"
            : "draw"}
        </div>
        {tnt.author === user!.uid && status.current().status !== "continue" && (
          <div className="">
            <button
              onClick={() => {
                restartTnt(tnt.id, liveTnt).catch((e) => {
                  // console.log(e)
                });
              }}
              className="bg-blue-100 text-blue-800 w-fit p-1 text-xs font-semibold  hover:bg-blue-200"
            >
              Restart
            </button>
            <button
              onClick={() => {
                endTnt(tnt.id).catch((e) => {
                  // console.log(e)
                });
              }}
              className="bg-red-100 text-red-800 w-fit p-1 text-xs font-semibold  hover:bg-red-200"
            >
              End Tnt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Box = ({
  liveTnt,
  uid,
  value,
  handleClickBox,
}: {
  liveTnt: tntProps["sessions"][0];
  uid: string;
  value: null | string | undefined;
  handleClickBox: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className={
        (value
          ? liveTnt.players.find((player) => player.uid === uid)!.value ===
            value
            ? "bg-sky-600 hover:bg-sky-700 "
            : "bg-amber-400 hover:bg-amber-500 "
          : "bg-sky-100 hover:bg-sky-200 ") +
        "h-12 w-12 text-white rounded-sm font-bold text-2xl"
      }
      onClick={handleClickBox}
    >
      {value && value}
    </button>
  );
};

export default TntBox;

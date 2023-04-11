import React, { useContext } from "react";
import { tntProps } from "../utils/types";
import getTntStatus from "../utils/checkForWin";
import AppContext from "../utils/app-context";
import { User } from "firebase/auth";

const TntEnded = ({ tnt }: { tnt: tntProps }) => {
  const status = getTntStatus(tnt).all();
  const user = useContext<User | null | undefined>(AppContext);
  const you = status.filter((_uid) => _uid === user!.uid)?.length;
  const opp = status.filter((_uid) => _uid !== user!.uid)?.length;
  return (
    <div className="h-full flex flex-col justify-center items-center overflow-auto">
      <img
        src={
          you < opp
            ? "https://img.icons8.com/color/96/null/sad-cat.png"
            : "https://img.icons8.com/color/96/null/dancing-party--v1.png"
        }
        alt="reaction"
        className="h-24 w-auto"
      />
      <div className="flex gap-6 mt-6">
        <ScoreBox title="You" opp={opp} you={you} />
        <ScoreBox title="Opponent" opp={you} you={opp} />
      </div>
    </div>
  );
};

const ScoreBox = ({
  title,
  you,
  opp,
}: {
  title: string;
  you: number;
  opp: number;
}) => {
  return (
    <div
      className={
        (you > opp ? "bg-sky-400 " : "bg-zinc-600 ") +
        "flex rounded-md h-24 w-24 items-center justify-center flex-col"
      }
    >
      <span
        className={
          (you > opp ? "text-gray-900 " : "text-gray-300 ") + "text-4xl"
        }
      >
        {you}
      </span>
      <span
        className={
          (you > opp ? "text-sky-900 " : "text-sky-400 ") +
          "text-sm font-semibold"
        }
      >
        {title}
      </span>
    </div>
  );
};

export default TntEnded;

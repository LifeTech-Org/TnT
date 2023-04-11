import { Timestamp } from "firebase/firestore";

type tntProps = {
  id: string;
  author: string;
  status: string;
  players: string[];
  timestamp: Timestamp;
  sessions: {
    id: number;
    players: { uid: string; value: string }[];
    status: string;
    plays: (null | string)[];
    turn: string;
  }[];
};

export type { tntProps };

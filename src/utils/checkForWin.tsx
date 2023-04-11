import { tntProps } from "./types";

const getTntStatus = (tnt: tntProps) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return {
    current: () => {
      const { plays } = tnt.sessions[tnt.sessions.length - 1];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (plays[a] && plays[a] === plays[b] && plays[a] === plays[c]) {
          return { status: "win", winner: plays[a] };
        }
      }
      if (plays.includes(null)) {
        return { status: "continue" };
      } else {
        return { status: "draw" };
      }
    },
    all: () => {
      const result = [];
      for (let i = 0; i < tnt.sessions.length; i++) {
        const { plays } = tnt.sessions[i];
        for (let j = 0; j < lines.length; j++) {
          const [a, b, c] = lines[j];
          if (plays[a] && plays[a] === plays[b] && plays[a] === plays[c]) {
            result.push(plays[a]);
          }
        }
      }
      return result;
    },
  };
};

export default getTntStatus;

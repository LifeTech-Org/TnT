import {
  DocumentData,
  DocumentReference,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, provider, signInWithRedirect, signOut } from "../firebase";
import { tntProps } from "./types";
import { User } from "firebase/auth";

const createNewTnt = (data: tntProps) => {
  return new Promise<string>((resolve, reject) => {
    addDoc(collection(db, "tnt"), data)
      .then((docRef) => resolve(docRef.id))
      .catch((err) => reject(err));
  });
};

const signIn = () => {
  return new Promise((resolve, reject) => {
    signInWithRedirect(auth, provider)
      .then(() => resolve({ status: "success" }))
      .catch(() => reject({ status: "failed" }));
  });
};

const signout = () =>
  new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => resolve({ status: "success" }))
      .catch(() => reject({ status: "failed" }));
  });

const verifyMembership = (tntId: string, user: User) => {
  return new Promise<void>((resolve, reject) => {
    getDoc(doc(db, "tnt", tntId))
      .then((docRef) => {
        if (docRef.exists()) {
          const tnt = docRef.data() as tntProps;
          //Check if user already exists
          if (tnt.players.includes(user.uid)) {
            resolve();
          }
          // If user doesnt exist ... Proceed to futher checking
          else {
            // Check if there is space to join the game

            //If there is space, then try to join
            if (tnt.players.length < 2) {
              updateDoc(doc(db, "tnt", tntId), {
                players: arrayUnion(user.uid),
                sessions: tnt.sessions.map((_tntSession, index) => {
                  if (index === tnt.sessions.length - 1) {
                    return {
                      ..._tntSession,
                      players: [
                        ..._tntSession.players,
                        { uid: user.uid, value: "O" },
                      ],
                    };
                  } else {
                    return _tntSession;
                  }
                }),
              })
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            }
            //If there is no space, then do nothing
            else {
              reject();
            }
          }
        } else {
          reject();
        }
      })
      .catch((err) => reject());
  });
};

const playTurn = (
  uid: string,
  tnt: tntProps,
  boxIndex: number,
  liveTnt: tntProps["sessions"][0]
) => {
  // Check if turn is right
  if (liveTnt.turn !== uid) {
    return;
  }
  const newTntSessionPlays = [
    ...liveTnt.plays.slice(0, boxIndex),
    uid,
    ...liveTnt.plays.slice(boxIndex + 1),
  ];
  const newSession = [
    ...tnt.sessions.map((_tntSession, index) => {
      if (_tntSession.id === liveTnt.id) {
        // Editing sessions is only possible for the last tnt ongoing
        return {
          ..._tntSession,
          plays: newTntSessionPlays,
          //   Change turn
          turn: _tntSession.players.find(({ uid }) => uid !== _tntSession.turn)
            ?.uid,
        };
      }
      return _tntSession;
    }),
  ];
  updateDoc(doc(db, "tnt", tnt.id), {
    sessions: newSession,
  });
};

const restartTnt = (tntId: string, liveTnt: tntProps["sessions"][0]) => {
  return new Promise((resolve, reject) => {
    updateDoc(doc(db, "tnt", tntId), {
      sessions: arrayUnion({
        id: liveTnt.id + 1,
        players: liveTnt.players,
        status: "continue",
        plays: [...new Array(9)].map(() => null),
        turn: liveTnt.turn,
      }),
    }).catch((e) => {
      reject(e);
    });
  });
};

const endTnt = (tntId: string) => {
  return new Promise((resolve, reject) => {
    updateDoc(doc(db, "tnt", tntId), {
      status: "end",
    }).catch((e) => reject(e));
  });
};

export {
  createNewTnt,
  signIn,
  signout,
  verifyMembership,
  playTurn,
  restartTnt,
  endTnt,
};

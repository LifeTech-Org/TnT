import { User } from "firebase/auth";
import { createContext } from "react";

const AppContext = createContext<User | null | undefined>(null);
export default AppContext;

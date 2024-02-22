import { useContext } from "react";
import AuthConext from "../contexts/AuthContext";

export default function useAuth() {
  const context = useContext(AuthConext);
  if (context === undefined)
    throw new Error("using AuthContex out of AuthProvider");
  return context;
}

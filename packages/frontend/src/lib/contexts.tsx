import { CacheType, createContext } from "reblendjs";
import IUser from "../interfaces/IUser";
import ITeam from "../interfaces/ITeam";
const AUTH_TOKEN_CONTEXT_KEY = "AUTH_TOKEN_CONTEXT_KEY";
export const authTokenContext = createContext("", {
  key: AUTH_TOKEN_CONTEXT_KEY,
  type: CacheType.LOCAL,
});

const USER_CONTEXT_KEY = "USER_CONTEXT_KEY";
export const userContext = createContext<IUser | null>(null, {
  key: USER_CONTEXT_KEY,
  type: CacheType.LOCAL,
});

export const teamPreviewContext = createContext<ITeam | null>(null);

export const loginRedirectUrl = createContext("");

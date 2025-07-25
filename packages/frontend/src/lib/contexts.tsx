import { CacheType, createContext } from "reblendjs";
import IUser from "../interfaces/IUser";
import ITeam from "../interfaces/ITeam";
import { IInvestment } from "../interfaces/IInvestment";
import { IAnimalInvestment } from "../interfaces/IAnimalInvestment";
import { IChickenInvestment } from "../interfaces/IChickenInvestment";
import { ICropInvestment } from "../interfaces/ICropInvestment";
import { ILandInvestment } from "../interfaces/ILandInvestment";
import { IFarmInvestment } from "../interfaces/IFarmInvestment";
const AUTH_TOKEN_CONTEXT_KEY = "AUTH_TOKEN_CONTEXT_KEY";
export const authTokenContext = createContext("", {
  cache: {
    key: AUTH_TOKEN_CONTEXT_KEY,
    type: CacheType.LOCAL,
  },
});

const USER_CONTEXT_KEY = "USER_CONTEXT_KEY";
export const userContext = createContext<IUser | null>(null, {
  cache: {
    key: USER_CONTEXT_KEY,
    type: CacheType.LOCAL,
  },
});

export const teamPreviewContext = createContext<ITeam | null>(null);

export const loginRedirectUrl = createContext("");

export const investmentContext = createContext<
  | IAnimalInvestment
  | IChickenInvestment
  | ICropInvestment
  | ILandInvestment
  | IFarmInvestment
  | null
>(null);


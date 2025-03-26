import { UserRole } from "../utils/enums";

export interface IUser {
  email: string;
  password: string;
  role: UserRole;
}

export interface ITokenPayload {
  id: string;
  role: UserRole;
}
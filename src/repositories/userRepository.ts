import UserModel, { IUser } from "../models/User";

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }): Promise<IUser> {
    return UserModel.create(data);
  }
}
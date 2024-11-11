export interface DTO {
    success: boolean;
    user?: IUser;
    auth: boolean;
    content?: any;
  }
  
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    voteTo: string | null;
  }
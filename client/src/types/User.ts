export interface IUser {
  email: string;
  name: string;
  password: string;
}

export interface IProfile {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  photo: {
    contentType: string;
    data: {
      type: string;
      data: number[];
    };
  };
  followers: string[];
  following: string[];
}

export interface INewPost {
  text: string;
  photo?: any;
}

export interface IPost {
  comments: any[];
  likes: any[];
  postedBy: string;
  text: string;
  photo: {
    contentType: string;
    data: {
      type: string;
      data: number[];
    };
  };
  _id: string;
  createdAt: string;
  updatedAt: string;
}

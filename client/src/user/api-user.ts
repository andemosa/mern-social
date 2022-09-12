import { IUser } from "types/User";

interface IParams {
  userId: string;
}

interface ICredentials {
  t: string;
}

const create = async (user: IUser) => {
  try {
    let response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const list = async (signal: any) => {
  try {
    let response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users`, {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (
  params: IParams,
  credentials: ICredentials,
  signal: any
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/users/` + params.userId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const update = async (
  params: IParams,
  credentials: ICredentials,
  user: any
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/users/` + params.userId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: user,
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params: IParams, credentials: ICredentials) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/users/` + params.userId,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const follow = async (
  params: IParams,
  credentials: ICredentials,
  followId: string
) => {
  try {
    let response = await fetch("/api/users/follow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, followId: followId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const unfollow = async (
  params: IParams,
  credentials: ICredentials,
  unfollowId: string
) => {
  try {
    let response = await fetch("/api/users/unfollow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const findPeople = async (
  params: IParams,
  credentials: ICredentials,
  signal: any
) => {
  try {
    let response = await fetch("/api/users/findpeople/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, list, read, update, remove, follow, unfollow, findPeople };
export type { IParams, ICredentials };

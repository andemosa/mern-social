import { IUser } from "types/User";

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
  params: { userId: string },
  credentials: { t: string },
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
  params: { userId: string },
  credentials: { t: string },
  user: Partial<IUser>
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/users/` + params.userId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(user),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const remove = async (
  params: { userId: string },
  credentials: { t: string }
) => {
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

export { create, list, read, update, remove };

import { IUser } from "types/User";

const signin = async (user: Pick<IUser, "email" | "password">) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/signin`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify(user),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const signout = async () => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/signout`,
      { method: "GET" }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { signin, signout };

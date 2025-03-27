import { makeCookieJWT as makeCookieToken } from "../components/CookieMaker";
import axios from "axios";

const userCurrentURI = `http://${process.env.API_SERVER_URL}/api/user`;

export const getCurrentUser = (token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(userCurrentURI, makeCookieToken(token));
      if (!data.id) {
        throw new Error("Not authorized");
      }
      resolve(data);
    } catch (err: any) {
      console.log(err);
      reject({
        status: err.response?.status || 500,
        message: err.response?.statusText || "Internal Server Error",
      });
    }
  });
};

import { makeCookieJWT as makeCookieToken } from "../components/CookieMaker";
import axios from "axios";
import { logger } from "../components/logger";

const userCurrentURI = `${process.env.API_SERVER_URL}/api/users/me`;

export const getCurrentUser = (token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(userCurrentURI, makeCookieToken(token));
      if (!data.id) {
        throw new Error("Not authorized");
      }
      resolve(data);
    } catch (err: any) {
      logger.error(`Error getting current user: ${err.message}`);
      reject({
        status: err.response?.status || 500,
        message: err.response?.statusText || "Internal Server Error",
      });
    }
  });
};

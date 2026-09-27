import "server-only";

import { getAuth } from "./server";
import { classifyAuthServerError } from "./server-errors";

export async function getServerSessionData() {
  try {
    const { data, error } = await getAuth().getSession();
    if (error) throw classifyAuthServerError(error);
    return data;
  } catch (cause) {
    throw classifyAuthServerError(cause);
  }
}

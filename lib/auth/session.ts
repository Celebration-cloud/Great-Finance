import "server-only";

import { unstable_rethrow } from "next/navigation";
import { getAuth } from "./server";
import { classifyAuthServerError } from "./server-errors";

export async function getServerSessionData() {
  try {
    const { data, error } = await getAuth().getSession();
    if (error) throw classifyAuthServerError(error);
    return data;
  } catch (cause) {
    unstable_rethrow(cause);
    throw classifyAuthServerError(cause);
  }
}

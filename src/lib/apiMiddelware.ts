// lib/authMiddleware.js

import { getSession } from "next-auth/react";

export async function authMiddleware(req, res, next) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

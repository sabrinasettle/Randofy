// pages/api/callback.js
export default async function handler(req, res) {
  const code = req.query.code || null;

  const redirect_uri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/callback"
      : "https://randofy.vercel.app/api/callback";

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOT_ID + ":" + process.env.SPOT_SECRET,
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // You can store this in a cookie or redirect with token in the URL
    res.redirect(`/?access_token=${data.access_token}`);
  } else {
    res.status(400).json({ error: "Token exchange failed", data });
  }
}

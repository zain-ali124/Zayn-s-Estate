import "dotenv/config"; // ✅ auto-load env FIRST (best solution)

import app from "./app.js";
import dbConnect from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

dbConnect();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

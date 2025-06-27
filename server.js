const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
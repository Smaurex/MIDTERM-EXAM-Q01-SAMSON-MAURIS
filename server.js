const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));


const items = [{
    id:1,
    item_name: "Item 1",
    category: "Category 1",
    location_found: "Location 1",
    date_found: "2023-01-01",
    claimed: false
}];


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
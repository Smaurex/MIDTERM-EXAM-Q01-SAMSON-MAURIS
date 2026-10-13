const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(__dirname));

function readItems(){
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return data.items;
}

function writeItems(items){
    fs.writeFileSync(DATA_FILE, JSON.stringify({ items }, null, 2));
}


app.get("/api/items", (req, res) => {
    const items = readItems();
    res.json(items);
});


app.get("/api/items/:id", (req, res)=>{
    const id = Number(req.params.id);
    const item = readItems().find(item =>
        item.id === id
    );

    if(!item){
        return res.status(404).json({
            message:"item not found"
        });
    }

    res.json(item);
});


app.post("/api/items", (req, res)=>{
    const { item_name, category, location_found, date_found } = req.body;

    if(!item_name || !category || !location_found || !date_found){
        return res.status(400).json({
            message:"all item fields are required"
        });
    }

    const items = readItems();
    const newItem = {
        id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
        item_name,
        category,
        location_found,
        date_found,
        claimed: false
    };

    items.push(newItem);
    writeItems(items);

    res.status(201).json(newItem);
});


app.delete("/api/items/:id", (req, res)=>{
    const id = Number(req.params.id);
    const items = readItems();
    const itemIndex = items.findIndex(item => item.id === id);

    if(itemIndex === -1){
        return res.status(404).json({
            message:"item not found"
        });
    }

    if(items[itemIndex].claimed){
        return res.status(400).json({
            message:"claimed items cannot be deleted"
        });
    }

    const deletedItem = items.splice(itemIndex, 1);
    writeItems(items);

    res.json({
        message:"item deleted",
        item: deletedItem[0]
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
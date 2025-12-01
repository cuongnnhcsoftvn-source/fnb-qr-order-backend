const express = require('express');
const mysql = require('mysql2');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" }});

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'dpg-d4mi3gu3jp1c739ujks0-a', // thay bằng cloud MySQL
  user: 'fnb_app_user',
  password: '6HAYc7CkyIxUEJ750ccuiJyLbMy6fl4K',
  database: 'fnb_app'
});

// API lấy menu
app.get('/api/menu', (req,res)=>{
  db.query('SELECT * FROM menu_items', (err, results)=>{
    if(err) return res.status(500).send(err);
    res.json(results);
  })
})

// API tạo order
app.post('/api/orders', (req,res)=>{
  const { table_id, items } = req.body;
  db.query('INSERT INTO orders (table_id) VALUES (?)', [table_id], (err,result)=>{
    if(err) return res.status(500).send(err);
    const order_id = result.insertId;
    const values = items.map(i=>[order_id, i.menu_item_id, i.quantity, i.note]);
    db.query('INSERT INTO order_items (order_id, menu_item_id, quantity, note) VALUES ?', [values], (err2)=>{
      if(err2) return res.status(500).send(err2);
      io.emit('new_order', { order_id, table_id, items });
      res.json({ success:true, order_id });
    })
  })
})

// Socket bếp
io.on('connection', (socket)=>{
  console.log('Kitchen connected: ', socket.id);
});

server.listen(3000, ()=>console.log('Server running on port 3000'));

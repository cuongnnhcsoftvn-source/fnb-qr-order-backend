const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" }});

app.use(cors());
app.use(express.json());

// PostgreSQL pool
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function connectWithRetry() {
  try {
    await pool.connect();
    console.log('PostgreSQL connected!');
  } catch (err) {
    console.error('DB connection error', err);
    setTimeout(connectWithRetry, 5000); // thử lại sau 5 giây
  }
}

connectWithRetry();


// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    console.log('PostgreSQL connected');
  }
  release();
});

// API lấy menu
app.get('/api/menu', async (req,res)=>{
  try {
    const result = await pool.query('SELECT * FROM menu_items ORDER BY id');
    res.json(result.rows);
  } catch(err){
    console.error(err);
    res.status(500).send(err);
  }
});

// API tạo order
app.post('/api/orders', async (req,res)=>{
  const { table_id, items } = req.body;
  try {
    const orderResult = await pool.query(
      'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING id',
      [table_id, 'new']
    );
    const order_id = orderResult.rows[0].id;

    for(const item of items){
      await pool.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, note) VALUES ($1,$2,$3,$4)',
        [order_id, item.menu_item_id, item.quantity, item.note || ""]
      );
    }

    io.emit('new_order', { order_id, table_id, items });
    res.json({ success:true, order_id });
  } catch(err){
    console.error(err);
    res.status(500).send(err);
  }
});

// Socket.IO realtime
io.on('connection', (socket)=>{
  console.log('Kitchen connected:', socket.id);
});

server.listen(process.env.PORT || 3000, ()=>console.log('Server running'));

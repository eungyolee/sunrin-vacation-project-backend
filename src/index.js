// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
const cors = require('cors');

// MongoDB 연결 설정
mongoose.connect('mongodb://root:Awdv0kApsSkK4pryC07MgU0uqhOFg6b02aqXH15Bsv0T5UuZWicrThPIS08b1Vyo@y80ks448gs80w0ks88c4woo4:27017/?directConnection=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 연결 에러:'));
db.once('open', () => {
  console.log('MongoDB에 성공적으로 연결되었습니다.');
});

app.use(cors());
app.use(express.json());

const postSchema = new mongoose.Schema({
  type: String,
  title: String,
  competition: String,
  field: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

// GET /posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('에러 발생');
  }
});

// POST /posts
app.post('/posts', async (req, res) => {
  const { type, title, competition, field, content } = req.body;
  try {
    const post = new Post({ type, title, competition, field, content });
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('에러 발생');
  }
});

// Delete /posts
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('에러 발생');
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

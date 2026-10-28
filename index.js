import express from "express";

const app = express();
const PORT = 3000;

// EJS as the view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Temporary in-memory storage
let posts = [];
let nextId = 1;

// Home page: show all posts
app.get("/", (req, res) => {
  res.render("home", { posts });
});

// Create a new post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send("Title and content are required.");
  }

  posts.unshift({
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
  });

  res.redirect("/");
});

// Show edit form
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!post) {
    return res.status(404).send("Post not found.");
  }

  res.render("edit", { post });
});

// Update a post
app.post("/posts/:id/edit", (req, res) => {
  const post = posts.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!post) {
    return res.status(404).send("Post not found.");
  }

  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send("Title and content are required.");
  }

  post.title = title.trim();
  post.content = content.trim();

  res.redirect("/");
});

// Delete a post
app.post("/posts/:id/delete", (req, res) => {
  const id = Number(req.params.id);
  const exists = posts.some((post) => post.id === id);

  if (!exists) {
    return res.status(404).send("Post not found.");
  }

  posts = posts.filter((post) => post.id !== id);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Blog running at http://localhost:${PORT}`);
});

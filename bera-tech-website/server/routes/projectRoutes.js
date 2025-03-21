const express = require("express");
const db = require("../db");
const authenticateToken = require("../auth");

const router = express.Router();

// ✅ Create a New Project
router.post("/add", authenticateToken, (req, res) => {
  const { name, description, estimated_cost, deadline } = req.body;
  const userId = req.user.id; // Get user ID from JWT token

  db.query(
    "INSERT INTO projects (user_id, name, description, estimated_cost, deadline) VALUES (?, ?, ?, ?, ?)",
    [userId, name, description, estimated_cost, deadline],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error adding project" });
      res.json({ message: "Project added successfully" });
    }
  );
});

// ✅ Get All Projects for a User
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query("SELECT * FROM projects WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching projects" });
    res.json(results);
  });
});

// ✅ Update a Project
router.put("/update/:id", authenticateToken, (req, res) => {
  const projectId = req.params.id;
  const { name, description, estimated_cost, deadline, status } = req.body;
  const userId = req.user.id;

  db.query(
    "UPDATE projects SET name=?, description=?, estimated_cost=?, deadline=?, status=? WHERE id=? AND user_id=?",
    [name, description, estimated_cost, deadline, status, projectId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating project" });
      res.json({ message: "Project updated successfully" });
    }
  );
});

// ✅ Delete a Project
router.delete("/delete/:id", authenticateToken, (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  db.query("DELETE FROM projects WHERE id=? AND user_id=?", [projectId, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting project" });
    res.json({ message: "Project deleted successfully" });
  });
});

module.exports = router;

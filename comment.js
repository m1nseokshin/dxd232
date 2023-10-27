app.post('/comments', async (req, res) => {
    const comment = new Comment({
      text: req.body.text
    });
    await comment.save();
    res.json(comment);
  });
  
  app.get('/comments', async (req, res) => {
    const comments = await Comment.find();
    res.json(comments);
  });
  
  app.put('/comments/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  });
  
  app.delete('/comments/:id', async (req, res) => {
    await Comment.findByIdAndRemove(req.params.id);
    res.json({ message: 'Comment deleted' });
  });
  
  // ...
  
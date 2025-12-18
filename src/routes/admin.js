app.use('/api/admin', adminRoutes);
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

router.patch('/users/:id/deactivate', auth, requireRole('admin'), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true });
});

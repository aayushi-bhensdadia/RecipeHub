// Unknown /api/... route
export const apiNotFound = (req, res) =>
  res.status(404).json({ error: 'Not found' });

// Central error handler (must have 4 arguments for Express to treat it as one)
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
};

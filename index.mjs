import app from './api/app.mjs';

export const server = app.listen(7000, () => {
  console.log('Server started on port 7000');
});

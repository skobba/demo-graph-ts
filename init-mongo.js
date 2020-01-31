db.createUser({
  user: 'demouser',
  pwd: 'demopass',
  roles: [{ role: 'readWrite', db: 'graphdemo' }]
});

const debugMiddleware = (req, res, next) => {
    console.log('\n=== DEBUG REQUEST ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('User:', req.user);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    console.log('=== END DEBUG ===\n');
    next();
  };
  
  module.exports = debugMiddleware;
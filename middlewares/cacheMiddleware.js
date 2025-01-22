const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const cacheMiddleware = (req, res, next) => {
  const key = req.body.text;
  
  if (key) {
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }
  }
  
  // Add cache setter to response
  const originalJson = res.json;
  res.json = function(data) {
    if (key && res.statusCode === 200) {
      cache.set(key, data);
    }
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = cacheMiddleware; 
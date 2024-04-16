const rateLimit = require('express-rate-limit');


const limiter = rateLimit({
  windowMs: 60 * 100, 
  max: 100,
});

export {limiter}

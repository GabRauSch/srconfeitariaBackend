const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  
export {corsOptions}
  
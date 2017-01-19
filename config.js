exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                        'mongodb://localhost/node-js-capstone' :
                        'mongodb://localhost/node-js-capstone');
exports.PORT = 3000;
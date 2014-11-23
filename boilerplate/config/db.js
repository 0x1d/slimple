/**
 * configuration for mongoDB 
 */
module.exports = {
    active: true,
    connectionString : 'mongodb://test:test@alex.mongohq.com:10041/mentalextract',
    connectionProperties:  { 
        server: { 
            poolSize: 10 
        } 
    }
};

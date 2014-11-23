/**
 * configuration for mongoDB 
 */
module.exports = {
    active: false,
    connectionString : '',
    connectionProperties:  { 
        server: { 
            poolSize: 10 
        } 
    }
};

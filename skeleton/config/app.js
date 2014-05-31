module.exports = {
    port: process.env.VCAP_APP_PORT || process.env.PORT || 8080,
    serviceLocation: '/services',
    eventLocation: '/events',
    contentLocation: '/content',
    schemaLocation: '/schemas',
    db: require('./db'),
    log: require('./log')
};
module.exports = {
    port: process.env.VCAP_APP_PORT || process.env.PORT || 8080,
    serviceLocation: '/addendum/services',
    eventLocation: '/addendum/events',
    contentLocation: '/addendum-test/content',
    schemaLocation: '/addendum/schemas',
    db: require('./db'),
    log: require('./log')
};
module.exports = {
    port: process.env.VCAP_APP_PORT || process.env.PORT || 8080,
    servicePath: '/slimple/skeleton/services',
    eventPath: '/slimple/skeleton/events',
    contentPath: '/slimple/skeleton/content',
    schemaPath: '/slimple/skeleton/schemas',
    db: require('./db'),
    log: require('./log')
};
module.exports = {
    port: process.env.VCAP_APP_PORT || process.env.PORT || 8080,
    servicePath: '/slimple/boilerplate/services',
    eventPath: '/slimple/boilerplate/events',
    contentPath: '/slimple/boilerplate/content',
    schemaPath: '/slimple/boilerplate/schemas',
    db: require('./db'),
    log: require('./log')
};
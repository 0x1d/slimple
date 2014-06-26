var crypto = require('crypto');

module.exports = {

    resource: '/auth',
    
    POST: function(ctx, http) {
        var data = http.data;
        var user = ctx.db.model("User");
        user.findOne({
            name: data.user
        }, function(err, foundUser) {
            if (!foundUser) {
                http.reply({
                    isLogin: false,
                    error: err
                });
            } else {
                var pwHash = crypto.createHash('md5').update(data.password).digest("hex");
                if (data.user == foundUser.name && pwHash == foundUser.password) {
                    http.session.set("user", data.user);
                    http.reply({
                        isLogin: true
                    });
                } else {
                    http.reply({
                        isLogin: false,
                        error: 'Wrong Username or Password'
                    });
                }
            }
        });
    }
    
};
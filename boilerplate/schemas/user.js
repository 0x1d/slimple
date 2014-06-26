module.exports = {
    name: 'User',
    schema: {
        name : { type : "String", required : true },
        password : { type : "String", required : true, encrypted: true },
        email : { type : "String", required : true },
        birthdate : { type : "String", required : false },
        country : { type : "String", required : false },
        city : { type : "String", required : false }
    }
};
module.exports = {
    name: 'TestSchema',
    schema : {
        field1 : { type : "String", required : true },
        field2 : { type : "String", required : false },
        field3 : { type : "String", required : false },
        field4 : { type : "String", required : false, default : "blablabla" },
        comments: [{ text: String, date: Date }]
    }
};
module.exports = {
    mapData: function(from, to) {
        for (var key in from) {
            if (from[key] !== null && from[key] !== 'undefined') {
                to[key] = from[key];
            }
        }
        return to;
    },
    jsonToParamString: function(json){
         var str = '';
         for(var key in json){
              str += '&'+key+'='+json[key];
         }
         str = str.replace('&','?');
         return str;
    }
};
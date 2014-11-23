/**
 *  Slimple UI and AJAX Toolkit
 */
var Sui = {

    ready: function(callback){
        document.addEventListener("DOMContentLoaded", function() {
            callback();
        }, false);
    },

    /**
     * utilities for data conversion and stuff.
     */
    util: {
        /**
         * serialize a flat object.
         * no nested objects possible yet.
         * TODO make this function recursiv for nested objects
         */
        serialize: function(obj) {
            var str = [];
            for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        },
        convertFormToJson: function(form){
            var data = {};
            for (var i = 0, ii = form.length; i < ii; ++i) {
                var input = form[i];
                if (input.name) {
                  data[input.name] = input.value;
                }
            }
            return data;
        },

        serializeForm: function(form){
            var data = Sui.util.convertFormToJson(form);
            return JSON.stringify(data);
        },
        processResponse: function(returnObject){
            if(returnObject.successful){                                
                //window.location.reload();
            } else {
                var msgStr = 'Required: \n';
                for(var k in returnObject.message){
                    msgStr += ' '+k+', ';
                }
                msgStr = msgStr.substring(0, msgStr.length - 2);
                //JSON.stringify(returnObject.message)
                alert(msgStr);
            }
        }
    },
    /**
     * http functions
     */
    http: {

        /**
         * ajax request
         * configuration object must have following structure:
         * {
         *      method: <'GET', 'POST', whatever >,
         *      endpoint: <URL to the service endpoint>,
         *      async: <true or false>,
         *      data: <json object with data>
         *  }
         * TODO synchronous calls
         *
         */
        ajax: function(config, callback){
            var noData = false;
            if(config.data === null){
                noData = true;
            }
            var serializedData = Sui.util.serialize(config.data);
            var endPointUrl = (config.method === 'GET' || config.method === 'DELETE') && noData !== true ? config.endpoint+'?'+serializedData : config.endpoint;
            var postData = config.method === 'POST' || config.method === 'PUT' ? serializedData : null;

            var http = new XMLHttpRequest();
            http.open(config.method, endPointUrl, config.async);
            http.setRequestHeader("X-cache","none");
            http.onreadystatechange = function () {
                if (http.readyState == 4) {
                    var responseTxt = http.responseText;
                    var returnJson = responseTxt;
                    if(http.status == 200){
                        returnJson = eval('(' + responseTxt + ')');
                        
                    }
                    callback(returnJson, http.status);
                }
            };
            http.send(postData);
        }
    },

    /**
     *  tools for building generic views 
     */
    view: {
        
        Manager: function(config){
            var that = this;
            var components = [];
            
            this.get = function(name){
                return components[name];
            };
            
            this.build = function(){
                for(var i = 0; i < config.views.length; i++){
                    config.views[i].build(that, {});
                    components[config.views[i].name] = config.views[i];
                }
            };
            
        },
        
        Component: function(config){
            
            // public vars
            this.name = config.name;
            this.dataStore = config.dataStore;
            this.manager = {};
            this.data = config.staticData ? config.staticData : { data : {} };
            this.functions = config.functions ? config.functions : {};
            this.type = config.type ? config.type : '';
            
            // private vars
            var that = this;
            var renderTo = config.renderTo;
            var templatePath = config.template;
            var template = {};
            var listeners = config.listeners;

            if(templatePath){
                template = new EJS({
                    url : templatePath+'?dt=' + Date.now()
                });
            }

            this.setDataStore = function(ds,cb){
                if(ds){
                    that.dataStore = ds;
                    that.dataStore.addListener(this);
                    if(that.dataStore.autoLoad === true){
                        that.dataStore.read();
                    }
                    if(cb){
                        cb(that);
                    }
                }
            };
            
            // public methods
            this.build = function(manager){
                that.manager = manager;
                //that.addListeners(listeners);
            };

            this.render = function(newData){
                if(newData){
                    that.data = newData;
                }
                template.update(renderTo, that.data); 
                that.addListeners(listeners);
            };
                        
            this.addListeners = function(listeners){
               for(var listener in listeners){
                    var currentListener = listeners[listener];
                    var elements = document.querySelectorAll(currentListener.element);
                    for(var i = 0; i < elements.length; i++){
                        elements.item(i).addEventListener(currentListener.event,(function(eventListener, cmp) {
                            return function(event){
                                event.preventDefault();
                                //var index = event.target.getAttribute("index");
                                eventListener.invoke(event, cmp);
                            };
                        })(currentListener, that));
                        
                    }
                } 
            };
            
            var dataEvents = {
                read: function(action){
                    if(that.type === 'list'){
                        that.render(that.dataStore.data);
                    }
                },
                readById: function(action){
                    if(that.type !== 'list'){
                        that.render(that.dataStore.currentRecord);
                    }
                },
                find: function(action){
                    that.render(that.dataStore.selectedData);
                },
                create: function(action){
                    that.dataStore.read(function(response, status){
                        that.render(response);
                    });
                },
                update: function(action){
                    that.dataStore.read(function(response, status){
                        that.render(response);
                    });
                },
                delete: function(action){
                    that.dataStore.read(function(response, status){
                        that.render(response);
                    });
                }
            };
            this.notify = function(action){
                dataEvents[action](action);
            };
            
             // init some stuff
            if(config.init){
                config.init(this);
            }
            that.setDataStore(that.dataStore, function(){
                if(that.dataStore.autoLoad === true){
                    that.dataStore.read();
                }
            });

        }
        
        
    },
        
    /**
     * data access
     */ 
    data: {
        
        Store: function(config){
            
            var that = this;
            var listeners = [];
            this.data = {};
            this.selectedData = {};
            this.currentRecord = {};
            this.service = config.endpoint;
            this.autoLoad = config.autoLoad ? config.autoLoad : false;
                        
            this.create = function(data, callback){
                that.exec({
                    method: 'POST',
                    data: JSON.stringify(data)
                }, function(response, status){
                    notifyListeners("create");
                    if(callback){
                        callback(response, status);
                    }
                });
            };
   
            
            this.readById = function(id, callback){
                that.exec({
                    method: 'GET',
                    service: that.service+'/'+id
                }, function(response, status){
                    that.currentRecord = response;
                    notifyListeners('readById');
                    if(callback){
                        callback(response, status);
                    }
                });
                
            };
            this.read = function(callback){

                that.exec({
                    method: 'GET'
                }, function(response, status){
                    that.data = response;
                    notifyListeners('read');
                    if(callback){
                        callback(response, status);
                    }
                });
                    
            };            

            this.find = function(query, callback){
             
                that.exec({
                  method: 'GET',
                  data: JSON.stringify({ 
                      query: JSON.stringify(query)
                  })
                },function(response, status){
                    that.selectedData = response;
                    notifyListeners("find");
                    if(callback){
                        callback(response, status);
                    }
                }); 
              
            };
            
            this.update = function(data, callback){
                that.exec({
                    method: 'PUT',
                    service: that.service+'/'+data.id,
                    data: JSON.stringify(data)
                }, function(response, status){
                    notifyListeners("update");
                    if(callback){
                        callback(response, status);
                    }
                });
            };
            
             this.delete = function(data, callback){
                that.exec({
                    method: 'DELETE',
                    service: that.service+'/'+data.id
                }, function(response, status){
                    notifyListeners("delete");
                    if(callback){
                        callback(response, status);
                    }
                });
            };
            
            this.exec = function(config, callback){
                Sui.http.ajax({
                    method: config.method,
                    endpoint: config.service ? config.service : this.service,
                    async: true,
                    data: config.data ? {
                        data: config.data,
                        timestamp: Date.now()
                    } : null
                }, function(data, status){
                    callback(data, status);
                });
            };
            
            function notifyListeners(action){
                for(var i = 0; i < listeners.length; i++){
                    listeners[i].notify(action);
                }
            }
            
            this.addListener = function(listener){
                listeners.push(listener);
            };
            
        }
    }

};
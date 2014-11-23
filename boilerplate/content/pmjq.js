/**
 * Poor Man's JQuery
 * Lightweight DOM manipulation utility
 */
var $ = function(selector){
    
    var that = this;
    var element = {};

    // utility functions    
    this.util = {
        // build a fragment from a given html string
        buildFragment: function(html){
            // set the html to a temporary element
            var nodeHolder = document.createElement('div');
            nodeHolder.innerHTML = html;
            // create a document fragment and append all input nodes
            var fragment = document.createDocumentFragment();
            while(nodeHolder.firstChild){
                fragment.appendChild(nodeHolder.firstChild);
            } 
            return fragment;
        }
    };
    // check if the input selector is already an element or a css selector
    if(selector.nodeType === 1){ // is element
        if(selector.is$()){ // check if the element is already extended
            return selector;
        }
        element = selector; // set the element to be extended
    } else { // the element is in fact a css selector
        element = document.querySelector(selector); // search for the element
    }

    // overload the innerHTML attribute
    element.html = function(val){
        this.innerHTML = val;
        return this;
    };

    // overload the value attribute
    element.val = function(val){
        this.value = val;
        return this;
    };

    // append the given string as child fragment
    element.append = function(html){
        var fragment = that.util.buildFragment(html); 
        this.appendChild(fragment);
        return this;
    };

    // prepend the given string as child fragment
    element.prepend = function(html){
        var fragment = that.util.buildFragment(html); 
        this.insertBefore(fragment,this.firstChild);        
        return this;
    };

    // search for an element inside of an element
    element.find = function(what){
        var found = $(what);
        if(found){
            return $(found);
        }
        return;
    }
    
    // get parent of the current element
    element.parent = function(){
        if(this.parentElement){
            return $(this.parentElement);
        }
    }

    // indicates that this element is a $ function
    element.is$ = function(){
        return true;
    }

    return element;
};
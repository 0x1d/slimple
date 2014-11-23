
/**
 * TODO: create module export
 * author: Matt Muelle
 */ 
 
/**
 * Remove an element from an array
 *
 * @param {Array} arr
 * @param {Mixed} el
 * @return {Array}
 */

function remove(arr, el) {
  var i = arr.indexOf(el);
  if(~i) arr.splice(i, 1);
  return arr;
}

/**
 * indexOf
 *
 * @param {Array} arr
 * @param {Mixed} obj
 * @return {Number}
 */

function indexOf(arr, obj){
  if ([].indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
}

/**
 * Unique-ify an array
 *
 * @param {Array} arr
 * @return {Array}
 */

function unique(arr) {
  var out = [],
      len = arr.length;

  for (var i = 0; i < len; i++) {
    for (var j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) j = ++i;
    }
    out.push(arr[i]);
  }

  return out;
};
/**
 * Created by macdja38 on 2016-04-09.
 */
var names = require('../../names.json');
var paths = require('../../paths.json');

var ParseState = function() {

};

ParseState.prototype.getName = function getName(path) {
    try{
        console.log(path);
        console.log(paths[path]);
        return names[paths[path].toLowerCase()].name;
    } catch (error) {
        console.error(error);
        console.error(path);
        return path;
    }
};

module.exports = ParseState;
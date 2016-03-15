/**
 * Created by macdja38 on 2016-03-12.
 */

var request = require("request");

var url = "http://content.warframe.com/dynamic/worldState.php";

var Config = function () {
    this.state = false;
    this.lastFech = 0;
    this.offset = 0;
    this.get(function (state) {
        this.state = state;
        this.lastFech = this.state.Time;
        console.log(Date.now());
        console.log(this.lastFech * 1000);
        this.offset = Date.now() - this.lastFech * 1000;
        console.log(this.offset);
    });
};

Config.prototype.get = function (_callback) {
    if (this.age() > 2000) {
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                this.state = body;
            } else {
                this.state = false;
            }
            console.log("Made worldstate Requst.")
            _callback(this.state);
        });
    }
    else {
        _callback(this.state);
    }
};

Config.prototype.age = function () {
    return Date.now() - this.lastFech * 1000 + this.offset;
};

module.exports = Config;
function ping(link) {
    $.getJSON(link, function(json){
        if(json.Players !== undefined) {
            return json.Players;
        } else {
            return 0;
        }
    });
}

module.exports = {
    ping: ping
};

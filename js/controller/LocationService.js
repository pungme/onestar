//location services
oneStarApp.service("locationService", function () {
    //TODO : move all the getting location from MainController to this !!!
    this.location = {};

    return {
        getLocation: function () {
            return this.location;
        },
        setLocation: function (lat,lon) {
            this.location = {lat : lat, lon : lon};
        }
    };

});
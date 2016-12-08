define([
    "mesa/searchCompleteWidget"
], function (searchCompleteWidget) {

    function _searchBy(type, option, device, turnOff) {
        var thisFunctionParam = "noPoint";
        var thisTargetGeometry = "polygon";
        var thisOutFields = "LOCATION";
        var thisService = "ParcelOnly4Query/MapServer/0/query";
        var thisType = "Address";
        switch (type) {
            case "address":
                thisTargetGeometry = "point";
                thisService = "ParcePointQuery/MapServer/0/query";
                break;
            case "intersection":
                thisFunctionParam = "Intersection";
                thisTargetGeometry = "point";
                thisOutFields = "Intersection";
                thisService = "roads_and_intersections/MapServer/0/query";
                thisType = "Intersection";
                break;
            case "account":
                thisOutFields = "ACCOUNTNO";
                thisType = "Account";
                break;
            case "parcelNo":
                thisOutFields = "PARCELNUM";
                thisType = "Parcel Number";
                break;
            case "subdivision":
                thisOutFields = "SUBNAME";
                thisService = "eSurveyor/MapServer/13/query";
                thisType = "Subdivision";
                break;
            case "place":
                thisFunctionParam = "FEATURE_NAME";
                thisTargetGeometry = "point";
                thisOutFields = "FEATURE_NAME";
                thisService = "PlaceNames/MapServer/0/query";
                thisType = "Place Name";
                break;
            case "PLSS":
                thisOutFields = "TRSM";
                thisService = "eSurveyor/MapServer/26/query";
                thisType = "Township/Range";
                break;
            case "Latitude/Longitude":
                thisFunctionParam = "gcs";
                thisTargetGeometry = "point";
                thisType = "Latitude/Longitude";
                break;
            default:
                alert("This tool has not been implemented");
        }
        new searchCompleteWidget({
            device: device,
            mapRef: aG.map,
            type: thisType,
            service: thisService,
            where: thisOutFields + " LIKE",
            outFields: thisOutFields,
            targetGeom: thisTargetGeometry,
            functionParam: thisFunctionParam,
            geometryServiceURL: esriConfig.defaults.geometryService,
            option: option !== undefined? option: undefined,
            turnOff: turnOff
        }, "searchFieldDialog").startup();
    } //end searchBy function

return {
    searchBy:_searchBy
    };//end of return object

});//end define

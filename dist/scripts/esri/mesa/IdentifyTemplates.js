define([
    "dojo/_base/array",
    "esri/dijit/PopupTemplate"
], function (array, PopupTemplate) {

    return {
        towers: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var feature = result.feature, fieldName = feature.attributes, html='';
                    if (fieldName.MAP_ID !== "Null") html += "<b>Site Inventory No: </b><a href='https://www.mesacounty.us/WorkArea/linkit.aspx?LinkIdentifier=id&ItemID=26132&libID=26277'>{MAP_ID}</a><br>";
                    if (fieldName.FCC_NO !== "Null") html += "<b>FCC #: </b>{FCC_NO}<br>";
                    if (fieldName.HEIGHT !== "Null") html += "<b>Height: </b>{HEIGHT}<br>";
                    if (fieldName.STRCTR_TYPE !== "Null") html += "<b>Structure Type: </b>{STRCTR_TYPE}<br>";
                    if (fieldName.TWR_OWNER_ID !== "Null") html += "<b>Tower Owner ID: </b>{TWR_OWNER_ID}<br>";
                    if (fieldName.TWR_OWNER != "Null") html += "<b>Tower Owner: </b>{TOWER_OWNER}<br>";
                        template = new PopupTemplate({
                            title: "Tower Information:",
                            description: html
                        });
                        feature.setInfoTemplate(template);
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        camera: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                        template = new PopupTemplate({
                            title: "Traffic Camera Information:",
                            description: "<div id='cameraDiv'><b>Location Name: {Name}</b><br><br>" +
                            "<b>Camera 1: </b><a href='{URL1}' target='_blank'><img height='150' width='190' src='{URL1}' alt='There is currently no view for this camera' /></a><br>" +
                            "<b>Camera 2: </b><a href='{URL2}' target='_blank'><img height='150' width='190' src='{URL2}' alt='There is currently no view for this camera' /></a><br>" +
                            "<b>Camera 3: </b><a href='{URL3}' target='_blank'><img height='150' width='190' src='{URL3}' alt='There is currently no view for this camera' /></a><br>" +
                            "<b>Camera 4: </b><a href='{URL4}' target='_blank'><img height='150' width='190' src='{URL4}' alt='There is currently no view for this camera' /></a><br><br>" +
                            "<b>Update frequency: </b>{Update_Freq}<br><br>" +
                            "<b>Camera Source: </b>{Source}</div>"
                        });
                        feature.setInfoTemplate(template);
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        enterprise: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                        template = new PopupTemplate({
                            title: "Current Enterprise Zone",
                            description: "Get more information about the current Enterprise Zone by visiting <a target='_blank' href='http://gjincubator.org/enterprise-zone/'>" +
                            "http://gjincubator.org/enterprise-zone/</a>"
                        });
                        feature.setInfoTemplate(template);
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        law: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'No Shooting Zones') {
                        template = new PopupTemplate({
                            title: "No Shooting Zone",
                            description:
                            "<a target='_blank' href='{viewerURL}'>Mesa County Firearms Resolution</a><br>" +
                            "<a target='_blank' href='{viewerURL2}'>Grand Junction Municipal Code</a><br>" +
                            "<a target='_blank' href='{viewerURL3}'>Fruita Firearm Ordinance</a><br><br>" +
                            "Exclusion from a No Shoot zone does not indicate permission to shoot. Other " +
                            "local, state or federal entities may have restrictions in place."
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Sheriffs Patrol Areas') {
                        template = new PopupTemplate({
                            title: "Sheriff's Patrol Areas",
                            description: "{FULLNAME}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        soilTyp: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    var template = new PopupTemplate({
                        title: "Mesa County Soils",
                        description: "<b>Soil Unit Name: </b><a target='_blank' href='https://emap.mesacounty.us/Soils/osd/{WEBLINK}.htm'>{MUNAME}</a><br><b>Farmland Capability: </b>{FARMLNDCL}<br><b>Flooding Frequency: </b>{FLODFREQDC}<br><b>Ponding Frequency: </b>{PONDFREQPR}"
                    });
                    feature.setInfoTemplate(template);
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        sep: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    var template = new PopupTemplate({
                        title: "Septic Systems",
                        description: "<b>Date: </b>{Date}<br><b>Tax Number: </b>{Tax Number}<br><b>Permit Number: </b>{Permit Number}<br><b>Street Address: </b>{Street Address}<br><b>Septic Records: </b><a target='_blank' href='https://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=h{Septic Records}'>{Septic Records}</a>"
                    });
                    feature.setInfoTemplate(template);
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        sales: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    var template = new PopupTemplate({
                        title: "Property Sales",
                        description: "<b>ACCOUNT NO: </b><a target='_blank' href='https://emap.mesacounty.us/assessor_lookup/Assessor_Parcel_Report.aspx?Account={ACCOUNTNO}'>{ACCOUNTNO}</a><br><b>PARCEL NO: </b>{PARCEL_NUM}<br><b>ASSOCPAR: </b>{ASSOCPAR}<br><b>OWNER: </b>{OWNER}<br><b>JOINT OWNER: </b>{JTOWNER}<br><b>LOCATION: </b>{LOCATION}<br><b>LOCATION ZIP: </b>{SITUS_ZIP}<br><b>ACRES: </b>{Acres}<br><b>SALE PRICE: </b>{SPRICE}<br><b>SALE DATE: </b>{SDATE}<br><b>SALE QUALIFICATION CODE: </b>{SQUAL}<br><b>SALE RECEPTION NO: </b><a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber={SRECPT}'>{SRECPT}</a><br><b>SALE COUNT: </b>{SCOUNT}<br><b>LOT: </b>{LOT}<br><b>BLOCK: </b>{BLOCK}<br><b>SUBDIVISION CODE: </b>{SCN}<br><b>NEIGHBORHOOD: </b>{NBHD}<br><b>NEIGHBORHOOD DESC: </b>{NBDESC}<br><b>LEGAL: </b>{LEGAL}<br><b>ECONOMIC AREA: </b>{ECON}<br><b>GRANTEE: </b>{GRANTEE}<br><b>GRANTOR: </b>{GRANTOR}<br><b>PROPERTY TYPE: </b>{PROPTYPE}<br><b>YEAR BUILT: </b>{AYB1ST}<br><b>EFFECTIVE YEAR BUILT: </b>{EFFYRBLT1ST}<br><b>ARCHETECTURAL TYPE: </b>{ARCH1ST}<br><b>TOTAL SQ FT: </b>{TOTHTSQF}<br><b>ROOMS: </b>{RMS1ST}<br><b>BEDROOMS: </b>{BDRMS1ST}<br><b>BATHROOMS: </b>{BTHS1ST}<br><b>TOTAL UNITS: </b>{TOTNOUNITS}<br><b>TOTAL BUILDINGS: </b>{TOTNOBLDGS}<br><b>BUILDING USE CODE: </b>{BLDGUSE}<br><b>LAND USE CODE: </b>{LNDUSE}<br><b>STATUS: </b>{STATUS}<br><b>TAC: </b>{TAC}<br><b>CURRENT LAND VALUE: </b>${LNDVALCUR}.00<br><b>CURRENT IMPROVEMENTS VALUE: </b>${IMPVALCUR}.00<br><b>TOTAL CURRENT VALUE: </b>${TOTVALCUR}.00<br><b>CURRENT LAND ASSESSED VALUE: </b>${LNDASSCUR}.00<br><b>CURRENT IMPROVEMENTS ASSESSED VALUE: </b>${IMPASSCUR}.00<br><b>CURRENT TOTAL ASSESSED VALUE: </b>${TOTASSCUR}.00<br><b>PREVIOUS LAND VALUE: </b>${LNDVALPRE}.00<br><b>PREVIOUS IMPROVEMENTS VALUE: </b>${IMPVALPRE}.00<br><b>TOTAL PREVIOUS VALUE: $</b>{TOTVALPRE}.00<br><b>PREVIOUS LAND ASSESSED VALUE: $</b>{LNDASSPRE}.00<br><b>PREVIOUS IMPROVEMENTS ASSESSED VALUE: $</b>{IMPASSPRE}.00<br><b>TOTAL PREVIOUS ASSESSED VALUE: </b>${TOTASSPRE}.00<br><b>MAILING ADDRESS: </b>{MAILING}<br>{CITY}, {ST}, {ZIP}<br><b>ZONING: </b>{ZONING}"
                    });
                    feature.setInfoTemplate(template);
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        zon: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Incorporated Areas') {
                        template = new PopupTemplate({
                            title: "Incorporated Area",
                            description: "<b>District: </b>{DISTRICT}<br><b>Further Information: </b><a target='_blank' href='{URL}'>{URL}</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Consolidated Zoning Districts') {
                        template = new PopupTemplate({
                            title: "Zoning Districts",
                            description: "<b>Zone Class: </b>{Zoning Classification}<br><b>Previous Zoning: </b>{PREV_CLASS}<br><b>Date of Rezone: </b>{Date_Rezone}<br><b>Year Rezoned: </b>{Year_Rezone}<br><b>Reception Number: </b>{Recept_Num}" + "<br><br><a target=_blank href='https://www.mesacounty.us/planning/land-development-code.aspx'>Mesa County Land Development Code</a>"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        trans: function (evt, deferred, len) {
            var contentArray;
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var n = result.layerName;
                    var feature = result.feature;
                    feature.attributes.layerName = n;
                    if (n === 'County Roads') {
                        template = new PopupTemplate({
                            title: n,
                            description: "Road Name: {NAME}<br>OHV allowed: {OHV}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (n === 'White' || n === 'Yellow' || n === 'Orange' || n === 'Black' || n === 'Red') {
                        template = new PopupTemplate({
                            title: "Load Limit Structure",
                            description: "<b>Name: </b>{Structure Name}<br><b>Location: </b>{Location}<br><b>Latitude: </b>{Latitude}<br><b>Longitude: </b>{Longitude}<br>" + "<a href='https://emap.mesacounty.us/viewerdocs/loadlimits/loadlegend.pdf'>Click for Load Limit information</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (n === 'Load Limit Roads') {
                        template = new PopupTemplate({
                            title: "Load Limit Roads",
                            description: "<b>Name: </b>{NAME}<br><b>Notes: </b>{NOTES}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (n === 'Escort Requirements') {
                        template = new PopupTemplate({
                            title: "Escort Requirements",
                            description: "<b>Name: </b>{NAME}<br>" + "<a href='https://emap.mesacounty.us/viewerdocs/loadlimits/escortlegend.pdf'>Click for Road Escort information</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (n === 'Regulatory Speed Limits') {
                        template = new PopupTemplate({
                            title: "Regulatory Speed Limits",
                            description: "<b>Sign ID: </b>{SignID}<br><b>Description: </b>{Description}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        topo: function (evt, deferred, len) {
            var elevation;
            var contentArray;
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === '2012 2 Ft. Contours' || result.layerName === '2001 2 Ft. Contours') {
                        template = new PopupTemplate({
                            title: result.layerName,
                            description: "Elevation: {Foot Elevation} Feet (approximate)"
                        });
                        feature.setInfoTemplate(template);
                    } else {
                        contentArray = array.map(response, function (item) {
                            return item;
                        });
                        elevation = contentArray[0].feature.attributes.Elevation_Ft;
                        elevation = elevation.substring(0, elevation.indexOf('.'));
                        template = new PopupTemplate({
                            title: "Digital Elevation Model",
                            description: "Elevation: " + elevation + " Feet (approximate)"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        dist: function (evt, deferred, len) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName !== 'Tax Assessor Code' && result.layerName !== 'Irrigation Districts') {
                        require([
                    "esri/dijit/PopupTemplate"
                ], function (PopupTemplate) {
                            template = new PopupTemplate({
                                title: "Districts",
                                description: "<b>Name: </b>{DISTRICT}"
                            });
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName !== 'Tax Assessor Code' && (result.layerName === 'Irrigation Districts')) {
                        require([
                    "esri/dijit/PopupTemplate"
                ], function (PopupTemplate) {
                            template = new PopupTemplate({
                                title: "Irrigation Districts and Service Areas",
                                description: "<b>Name: </b><a href='{URL}'>{ALT_NAME}"
                            });
                        });
                        feature.setInfoTemplate(template);

                    } else {
                        require([
                    "esri/dijit/PopupTemplate"
                ], function (PopupTemplate) {
                            template = new PopupTemplate({
                                title: "Tax Assessor Code ",
                                description: "<b>Code: </b>{TAC}"
                            });
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });

            if (lmG.pLay.visibleAtMapScale !== true) {
                aG.map.infoWindow.setFeatures([deferred]);
                aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
            } else {
                lmG.pLay.infoTemplate = aG.pTemp;
            }
        },

        vac: function (evt, deferred, len) {
            var desc = "<b>ACCOUNT NO: </b><a target='_blank' href='https://emap.mesacounty.us/assessor_lookup/Assessor_Parcel_Report.aspx?Account={ACCOUNTNO}'>{ACCOUNTNO}</a><br><b>PARCEL NO: </b>{PARCEL_NUM}" + "<br><b>LOCATION: </b>{LOCATION}<br><b>LOCATION ZIP: </b>{SITUS_ZIP}<br>          <b>MAILING ADDRESS: </b>{MAILING}" + "<br>{CITY}, {ST}, {ZIP}<br><b>APPROXIMATE ACRES: </b>{Acres}<br><b>SALE PRICE: </b>{SPRICE}<br><b>SALE DATE: </b>{SDATE}" + "<br><b>SALE QUALIFICATION CODE: </b>{SQUAL}<br><b>SALE RECEPTION NO: </b><a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber={SRECPT}'>{SRECPT}</a>" + "<br><b>SALE COUNT: </b>{SCOUNT}<br><b>SUBDIVISION CODE: </b>{SCN}<br><b>NEIGHBORHOOD: </b>{NBHD}<br><b>NEIGHBORHOOD DESC: </b>{NBDESC}<br><b>LEGAL: </b>{LEGAL}" + "<br><b>ECONOMIC AREA: </b>{ECON}<br><b>PROPERTY TYPE: </b>{PROPTYPE}<br><b>LAND USE CODE: </b>{LNDUSE}<br><b>STATUS: </b>{STATUS}<br><b>TAC: </b>{TAC}<br><b>CURRENT LAND VALUE: </b>${LNDVALCUR}.00" + "<br><b>CURRENT LAND ASSESSED VALUE: </b>${LNDASSCUR}.00<br><b>ZONING: </b>{ZONING}<br><b>JURISDICTION: </b>{Juris}<br><b>PLANNING AREA: </b>{Planning_Area}";
            deferred.addCallback(function (response) {

                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Platted') {
                        template = new PopupTemplate({
                            title: "Platted Non-Ag",
                            description: desc
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Non Platted') {
                        template = new PopupTemplate({
                            title: "Non-Platted, Non-Ag",
                            description: desc
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Platted - No House') {
                        template = new PopupTemplate({
                            title: "Platted - No House",
                            description: desc
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Non Platted - No House') {
                        template = new PopupTemplate({
                            title: "Non Platted - No House",
                            description: desc
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        trl: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Trailheads & Parking') {
                        template = new PopupTemplate({
                            title: "Trailheads & Parking",
                            description: "<b>Name: </b>{Name}<br><b>Feature Description: </b>{Type}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Recreation_Sites') {
                        template = new PopupTemplate({
                            title: "Recreation_Sites",
                            description: "<b>Name: </b>{Name}<br><b>Feature Description: </b>{Symbol}<br><b>Source: </b>{Source}<br><b>Latitude: </b>{Lat}<br><b>Longitude: </b>{Long}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Trails') {
                        template = new PopupTemplate({
                            title: "Trails",
                            description: "<b>Route Name: </b>{ROUTE_NAME}<br><b>Feature Type: </b>{TYPE}<br><b>Use: </b>{SYMBOL}<br><b>Status: </b>{STATUS}<br><b>Section Length(mi): </b>{LENGTH_MI}<br><b>Ownership: </b>{OWNERSHIP}<br><b>Source: </b>{SOURCE}" + "<br><b>Difficulty: </b>{DIFFICULTY}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        strm: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Drainage Outfalls') {
                        template = new PopupTemplate({
                            title: "{FEAT_DESC}",
                            description: "<b>Feature Description: </b>{FEAT_DESC}<br><b>Source: </b>{SOURCE}<br><b>Owner: </b>{OWNER}<br><b>Maintained by: </b>{MAINT_BY}<br><b>Feature Type: </b>{FEAT_TYPE}<br><b>Feature Description: </b>{FEAT_DESC}" + "<br><b>Collection Method: </b>{COLLECT_METHOD}<br><b>Collection Accuracy: </b>{COLLECT_ACCURACY}<br><b>Basin: </b>{BASIN}<br><b>Drainage: </b>{DRAINAGE}<br><b>Elevation: </b>{FL_ELEV}<br><b>Outfall Width: </b>{OUTFALL_WIDTH}" + "<br><b>Outfall Material: </b>{OUTFALL_MATERIAL}<br><b>Gated: </b>{GATED}<br><b>Condition: </b>{CONDITION}<br><b>Notes: </b>{NOTES}<br><b>Drains Into: </b>{DRAINS_INTO}<br><b>Install Date: </b>{INSTALL_DATE}" + "<br><b>Maintenance Date: </b>{MAINT_DATE}<br><b>Collection Date: </b>{COLLECT_DATE}<br><b>Collected By: </b>{COLLECT_BY}<br><b>Edit Date: </b>{EDIT_DATE}<br><b>Edited By: </b>{EDIT_BY}<br><b>Delete Tag: </b>{DELETE_TAG}" + "<br><b>Edit Comment: </b>{EDIT_COMMENT}<br><b>Source Data Layer: </b>{SOURCEDATALAYER}<br><b>Enabled: </b>{ENABLED}<br><b>Ancillary Role: </b>{ANCILLARYROLE}<br><b>Latitude: </b>{LATITUDE}<br><b>Longitude: </b>{LONGITUDE}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Drainage Pipe Ends') {
                        template = new PopupTemplate({
                            title: "{FEAT_DESC}",
                            description: "<b>Feature Description: </b>{FEAT_DESC}<br><b>Source: </b>{Source}<br><b>Owner: </b>{Owner}<br><b>Maintained by: </b>{Maint_By}<br><b>Feature Description: </b>{Feat_Desc}<br><b>Location: </b>{Location}" + "<br><b>Collection Method: </b>{Collect_Method}<br><b>Collection Accuracy: </b>{Collect_Accuracy}<br><b>Basin: </b>{Basin}<br><b>Drainage: </b>{Drainage}<br><b>Elevation: </b>{FL_Elev}<br><b>Structure Length: </b>{Struct_Length}" + "<br><b>Structure Width: </b>{Struct_Width}<br><b>Structure Height: </b>{Struct_Height}<br><b>Structure Material: </b>{Struct_Material}<br><b>Condition: </b>{Condition}<br><b>Notes: </b>{Notes}<br><b>Drains Into: </b>{Drains_Into}" + "<br><b>Install Date: </b>{Install_Date}<br><b>Grate: </b>{Grate}" + "<br><b>Maintenance Date: </b>{Maint_Date}<br><b>Collection Date: </b>{Collect_Date}<br><b>Collected By: </b>{Collect_By}<br><b>Edit Date: </b>{Edit_Date}<br><b>Edited By: </b>{Edit_By}<br><b>Delete Tag: </b>{Delete_Tag}" + "<br><b>Edit Comment: </b>{Edit_Comment}<br><b>Source Data Layer: </b>{SourceDataLayer}<br><b>Enabled: </b>{Enabled}<br><b>Ancillary Role: </b>{AncillaryRole}<br><b>Latitude: </b>{Latitude}<br><b>Longitude: </b>{Longitude}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Manholes') {
                        template = new PopupTemplate({
                            title: "{Feat_Desc}",
                            description: "<b>Source: </b>{Source}<br><b>Owner: </b>{Owner}<br><b>Maintained by: </b>{Maint_By}<br><b>Feature Description: </b>{Feat_Desc}<br><b>Location: </b>{Location}" + "<br><b>Collection Method: </b>{Collect_Method}<br><b>Collection Accuracy: </b>{Collect_Accuracy}<br><b>Basin: </b>{Basin}<br><b>Drainage: </b>{Drainage}<br><b>Rim Elevation: </b>{Rim_Elev}<br><b>Structure Diameter: </b>{Struct_Diameter}" + "<br><b>Structure Depth: </b>{Struct_Depth}<br><b>Structure Material: </b>{Struct_Material}<br><b>Lid Type: </b>{Lid_Type}<br><b>Condition: </b>{Condition}<br><b>Notes: </b>{Notes}<br><b>Install Date: </b>{Install_Date}" + "<br><b>Maintenance Date: </b>{Maint_Date}<br><b>Collection Date: </b>{Collect_Date}<br><b>Collected By: </b>{Collect_By}<br><b>Edit Date: </b>{Edit_Date}<br><b>Edited By: </b>{Edit_By}<br><b>Delete Tag: </b>{Delete_Tag}" + "<br><b>Edit Comment: </b>{Edit_Comment}<br><b>Source Data Layer: </b>{SourceDataLayer}<br><b>Enabled: </b>{Enabled}<br><b>Ancillary Role: </b>{AncillaryRole}<br><b>Latitude: </b>{Latitude}<br><b>Longitude: </b>{Longitude}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Drainage Inlets/Catch Basin') {
                        template = new PopupTemplate({
                            title: "{Feat_Desc}",
                            description: "<b>Source: </b>{Source}<br><b>Owner: </b>{Owner}<br><b>Maintained by: </b>{Maint_By}<br><b>Feature Description: </b>{Feat_Desc}<br><b>Location: </b>{Location}" + "<br><b>Collection Method: </b>{Collect_Method}<br><b>Collection Accuracy: </b>{Collect_Accuracy}<br><b>Basin: </b>{Basin}<br><b>Drainage: </b>{Drainage}<br><b>Rim Elevation: </b>{Rim_Elev}<br><b>Structure Diameter: </b>{Struct_Diameter}" + "<br><b>Structure Depth: </b>{Struct_Depth}<br><b>Structure Material: </b>{Struct_Material}<br><b>Lid Type: </b>{Lid_Type}<br><b>Condition: </b>{Condition}<br><b>Notes: </b>{Notes}<br><b>Install Date: </b>{Install_Date}" + "<br><b>Maintenance Date: </b>{Maint_Date}<br><b>Collection Date: </b>{Collect_Date}<br><b>Collected By: </b>{Collect_By}<br><b>Edit Date: </b>{Edit_Date}<br><b>Edited By: </b>{Edit_By}<br><b>Delete Tag: </b>{Delete_Tag}" + "<br><b>Edit Comment: </b>{Edit_Comment}<br><b>Source Data Layer: </b>{SourceDataLayer}<br><b>Enabled: </b>{Enabled}<br><b>Ancillary Role: </b>{AncillaryRole}<br><b>Latitude: </b>{Latitude}<br><b>Longitude: </b>{Longitude}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Other Points') {
                        template = new PopupTemplate({
                            title: "{Feat_Desc}",
                            description: "<b>Source: </b>{Source}<br><b>Owner: </b>{Owner}<br><b>Maintained by: </b>{Maint_By}<br><b>Feature Description: </b>{Feat_Desc}<br><b>Location: </b>{Location}" + "<br><b>Collection Method: </b>{Collect_Method}<br><b>Collection Accuracy: </b>{Collect_Accuracy}<br><b>Basin: </b>{Basin}<br><b>Drainage: </b>{Drainage}<br><b>Rim Elevation: </b>{Rim_Elev}<br><b>Structure Length: </b>{Struct_Length}" + "<br><b>Structure Width: </b>{Struct_Width}<br><b>Structure Depth: </b>{Struct_Depth}<br><b>Structure Height: </b>{Struct_Height}<br><b>Structure Material: </b>{Struct_Material}" + "<br><b>Condition: </b>{Condition}<br><b>Notes: </b>{Notes}<br><b>Install Date: </b>{Install_Date}" + "<br><b>Maintenance Date: </b>{Maint_Date}<br><b>Collection Date: </b>{Collect_Date}<br><b>Collected By: </b>{Collect_By}<br><b>Edit Date: </b>{Edit_Date}<br><b>Edited By: </b>{Edit_By}<br><b>Delete Tag: </b>{Delete_Tag}" + "<br><b>Edit Comment: </b>{Edit_Comment}<br><b>Source Data Layer: </b>{SourceDataLayer}<br><b>Enabled: </b>{Enabled}<br><b>Ancillary Role: </b>{AncillaryRole}<br><b>Latitude: </b>{Latitude}<br><b>Longitude: </b>{Longitude}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Canals' || result.layerName === 'Washes' || result.layerName === 'Open Channels') {
                        template = new PopupTemplate({
                            title: "{Feat_Desc}",
                            description: "<b>Source: </b>{Source}<br><b>Owner: </b>{Owner}<br><b>Maintained by: </b>{Maint_By}<br><b>Legend: </b>{Legend}<br><b>Feature Type: </b>{Feat_Type}<br><b>Feature Description: </b>{Feat_Desc}<br><b>Class: </b>{Class}" + "<br><b>Collection Method: </b>{Collect_Method}<br><b>Collection Accuracy: </b>{Collect_Accuracy}<br><b>Geographic Name: </b>{Geographic_Name}<br><b>Basin: </b>{Basin}<br><b>Drainage: </b>{Drainage}" + "<br><b>Channel Length: </b>{ChannelLength}<br><b>Channel Class: </b>{ChannelClass}<br><b>Channel Lining: </b>{ChannelLining}<br><b>Channel Shape: </b>{ChannelShape}<br><b>Stream Flow: </b>{StreamFlow}" + "<br><b>Condition: </b>{Condition}<br><b>Notes: </b>{Notes}<br><b>Install Date: </b>{Install_Date}<br><b>Maintenance Date: </b>{Maint_Date}<br><b>Collection Date: </b>{Collect_Date}<br><b>Collected By: </b>{Collect_By}" + "<br><b>Edit Date: </b>{Edit_Date}<br><b>Edited By: </b>{Edit_By}<br><b>Delete Tag: </b>{Delete_Tag}<br><b>Edit Comment: </b>{Edit_Comment}<br><b>Source Data Layer: </b>{SourceDataLayer}<br><b>Enabled: </b>{Enabled}<br><b>Ancillary Role: </b>{AncillaryRole}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Closed/Below Ground Conduits') {
                        template = new PopupTemplate({
                            title: "{Feat_Desc}",
                            description: "<b>Source: </b>{Source}<br><b>Owner: </b>{Owner}<br><b>Maintained by: </b>{Maint_By}<br><b>Legend: </b>{Legend}<br><b>Feature Type: </b>{Feat_Type}<br><b>Feature Description: </b>{Feat_Desc}<br><b>Class: </b>{Class}" + "<br><b>Collection Method: </b>{Collect_Method}<br><b>Collection Accuracy: </b>{Collect_Accuracy}<br><b>Geographic Name: </b>{Geographic_Name}<br><b>Basin: </b>{Basin}<br><b>Drainage: </b>{Drainage}" + "<br><b>Upstream Elevation: </b>{Upstream_Elev}<br><b>Downstream Elevation: </b>{Downstream_Elev}" + "<br><b>Conduit Length: </b>{ConduitLength}<br><b>Conduit Diameter: </b>{ConduitDiameter}<br><b>Conduit Height: </b>{ConduitHeight}<br><b>Conduit Width: </b>{ConduitWidth}<br><b>Conduit Thickness: </b>{ConduitThickness}<br><b>Conduit Material: </b>{ConduitMaterial}" + "<br><b>Condition: </b>{Condition}<br><b>Notes: </b>{Notes}<br><b>Install Date: </b>{Install_Date}<br><b>Maintenance Date: </b>{Maint_Date}<br><b>Collection Date: </b>{Collect_Date}<br><b>Collected By: </b>{Collect_By}" + "<br><b>Edit Date: </b>{Edit_Date}<br><b>Edited By: </b>{Edit_By}<br><b>Delete Tag: </b>{Delete_Tag}<br><b>Edit Comment: </b>{Edit_Comment}<br><b>Source Data Layer: </b>{SourceDataLayer}<br><b>Enabled: </b>{Enabled}<br><b>Ancillary Role: </b>{AncillaryRole}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'USGS NHD Flowline Data') {
                        template = new PopupTemplate({
                            title: "USGS NHD Flowline Data",
                            description: "<b>Name: </b>{GNIS_Name}<br><b>ID: </b>{GNIS_ID}<br><b>Date: </b>{FDate}<br><b>Resolution: </b>{Resolution}<br><b>Length (KM): </b>{LengthKM}<br><b>Reach Code: </b>{ReachCode}<br><b>Flow Direction: </b>{FlowDir}" + "<br><b>Type: </b>{FType}<br><b>Code: </b>{FCode}<br><b>Enabled: </b>{Enabled}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Detention Ponds') {
                        template = new PopupTemplate({
                            title: "Detention Ponds",
                            description: "<b>Source: </b>{Source}<br><b>Owner: </b>{Owner}<br><b>Maintained by: </b>{Maint_By}<br><b>Legend: </b>{Legend}<br><b>Feature Type: </b>{Feat_Type}<br><b>Collection Method: </b>{Collect_Method}" + "<br><b>Collection Accuracy: </b>{Collect_Accuracy}<br><b>Basin: </b>{Basin}<br><b>Drainage: </b>{Drainage}<br><b>Location: </b>{Location}<br><b>Parcel: </b>{Parcel}<br><b>Rim Elevation: </b>{Rim_Elev}" + "<br><b>Material: </b>{Material}<br><b>Trickle Channel: </b>{TrickleChannel}<br><b>Standing Water: </b>{StandingWater}<br><b>Photo Year: </b>{PhotoYear}<br><b>Condition: </b>{Condition}<br><b>Notes: </b>{Notes}" + "<br><b>Install Date: </b>{Install_Date}<br><b>Maintenance Date: </b>{Maint_Date}<br><b>Collection Date: </b>{Collect_Date}<br><b>Collected By: </b>{Collect_By}<br><b>Edit Date: </b>{Edit_Date}" + "<br><b>Edited By: </b>{Edit_By}<br><b>Delete Tag: </b>{Delete_Tag}<br><b>Edit Comment: </b>{Edit_Comment}<br><b>Source Data Layer: </b>{SourceDataLayer}<br><b>Enabled: </b>{Enabled}<br><b>Ancillary Role: </b>{AncillaryRole}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        pol: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Mesa County Commissioner Districts') {
                        template = new PopupTemplate({
                            title: "Commissioner Districts",
                            description: "<b>District: </b> {UNIT}<br><b>Representative: </b><a target='_blank' href='{URL}'>{REP}</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'City Council Districts') {
                        template = new PopupTemplate({
                            title: "City Council Districts",
                            description: "<b>District: </b> {DISTRICT}<br><b>Representative: </b><a target='_blank' href='{URL}'>{REP_NAME}</a><br><b>Phone Number: </b>{PH_NUMBER}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Mesa County Precincts') {
                        template = new PopupTemplate({
                            title: "County Voter Precincts",
                            description: "<b>Precinct: </b>{Precinct}<br><b>CRS Code: </b>{CRS_CODE}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'School District 51 Board Boundaries') {
                        template = new PopupTemplate({
                            title: "School District 51 Board",
                            description: "<b>Name: </b>{Name}<br><b>Website: </b><a target='_blank' href='https://connect.d51schools.org/sites/shared/boe/Pages/Board-of-Education-Members.aspx'>https://connect.d51schools.org/sites/shared/boe/Pages/Board-of-Education-Members.aspx</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'State Senate Boundaries') {
                        template = new PopupTemplate({
                            title: "State Senate",
                            description: "<b>District: </b><a target='_blank' href='http://www.leg.state.co.us/CLICS/CLICS2014A/directory.nsf/MemberDetailPage?OpenForm&district={DISTRICT}&chamber=senate'>{DISTRICT}</a><br><b>Population: </b>{POPULATION}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'State House Representative Boundaries') {
                        template = new PopupTemplate({
                            title: "State House",
                            description: "<b>District: </b><a target='_blank' href='http://www.leg.state.co.us/CLICS/CLICS2014A/directory.nsf/MemberDetailPage?OpenForm&district={District_N}&chamber=house'>{District_N}</a>"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        persigo: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Urban Development Boundary') {
                        template = new PopupTemplate({
                            title: "",
                            description: "Urban Development Boundary Area"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Persigo 201 Service Area Boundary') {
                        template = new PopupTemplate({
                            title: "",
                            description: "Persigo 201 Service Area Boundary"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'City of Grand Junction') {
                        template = new PopupTemplate({
                            title: "Grand Junction",
                            description: "City of Grand Junction Boundary"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Grand Jct - Fruita Cooperative Planning Area' || result.layerName === 'Grand Jct - Palisade Cooperative Planning Area') {
                        template = new PopupTemplate({
                            title: "",
                            description: result.layerName
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Redlands Parcels Located Within 1/4 Mile of Grand Junction') {
                        template = new PopupTemplate({
                            title: "1/4 Mile Buffer",
                            description: "<b>Redlands Parcels Located Within 1/4 Mile of Grand Junction"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Sewer Taps for Persigo Map') {
                        template = new PopupTemplate({
                            title: "Persigo Sewer Taps",
                            description: "<b>Tap ID: </b>{ID}<br><b>Type: </b>{Type}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        mos: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Mosquito Traps') {
                        template = new PopupTemplate({
                            title: "Mosquito Trap",
                            description: "<b>Trap ID: </b>{TRAPID}<br><b>Trap Name: </b>{TrapName}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Survey 2') {
                        template = new PopupTemplate({
                            title: "Survey",
                            description: "<b>Title: </b>Department of Env. Health Survey<br><b>ID: </b>{ID}<br><b>Label: </b>{Label}<br><b>Type: </b>{Type}<br><b>Symbol: </b>{Symbol}<br><b>Rank: </b>{Rank}" + "<br><b>Description: </b>{Descriptio}<br><b>Waypoint: </b>{Waypoint}<br><b>Comment: </b>{Comment}<br><b>Latitude: </b>{Latitude}<br><b>Longitude: </b>{Longitude}" + "<br><b>Elevation: </b>{Elevation}<br><b>Distance: </b>{Distance_t}<br><b>Bearing: </b>{Bearing}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Mosquito Treatment Areas') {
                        template = new PopupTemplate({
                            title: "Treatment Areas",
                            description: "<b>ID: </b>{ID}<br><b>Place Name: </b>{NAME}<br><b>Treatment ID: </b>{mcgis_GISCREATOR_Moz_Treatm_4}<br><b>Acres: </b>{ACRES}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Redlands Mosquito Control District') {
                        template = new PopupTemplate({
                            title: "Mosquito Control",
                            description: "<b>District Name: </b>{DISTRICT}<br><b>Abbrev: </b>{ABBREV}<br><b>Acres: </b>{ACRES}<br><b>Perimeter: </b>{PERIMETER}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        landDev: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    template = new PopupTemplate({
                        title: result.layerName,
                        description: "<b>Project Number: </b><a target='_blank' href='https://www.mesacounty.us/Planning/ProjectDetail.aspx?pn={Land Project Number}'>{Land Project " +
                            "Number}<br><b>Project Name: </b> {Project Name}<br><b>Year: </b> {Year}<br><b>Status: </b> {STATUS}"
                    });
                    feature.setInfoTemplate(template);
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        flu: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Village Center' || result.layerName === 'Blended Residential Land Use' || result.layerName === 'Grand Junction Comprehensive Area FLU') {
                        template = new PopupTemplate({
                            title: "Future Land Use",
                            description: "<b>Layer Name: </b>" + result.layerName + "<br><b>Preferred: </b>{Preferred}<br><b>Legend: </b>{Legend}<br><b>Abreviation: </b>{Abreviation}<br><b>Online Docs: </b><a target='_blank' href='{URL}'>GJ Comprehensive Plan</a>" + "<br><b>Blended FLU: </b>{BLENDED_FLU}<br><b>Blended Docs: </b><a target='_blank' href='{BLENDED_URL}'>GJ Comprehensive Plan</a><br><b>Blended Units: </b>{BLENDED_UNITS}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Mixed Use Opportunity Corridors') {
                        template = new PopupTemplate({
                            title: "Mixed Use Corridors",
                            description: "<b>Layer Name: </b>Mixed Use Opportunity Corridors<br><b>Online Docs: </b><a target='_blank' href='{URL}'>GJ Comprehensive Plan</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Fruita Greenway Business Park' || result.layerName === 'Gateway FLU' || result.layerName === 'Loma FLU' || result.layerName === 'Mack FLU' || result.layerName === 'Rural Community' || result.layerName === 'Rural FLU') {
                        template = new PopupTemplate({
                            title: "Future Land Use",
                            description: "<b>Layer Name: </b>" + result.layerName + "<br><b>FLU Class: </b>{FLU_CLASS}<br><b>Perimeter: </b>{PERIMETER}<br><b>Acres: </b>{ACRES}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        flood: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'FEMA Map Panel Index') {
                        template = new PopupTemplate({
                            title: "FEMA Map Panel Index",
                            description: "<b>Layer Name: </b>FEMA Map Panel Index<br><b>FIRM Panel Number: </b><a title='Click to view FIRM panel map' href='https://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=F{FIRM_PAN}'>{FIRM_PAN}</a><br><br>" + "<a title='The FEMA Map Service Center provides access to LOMC documents (if available)' href='https://msc.fema.gov/webapp/wcs/stores/servlet/MapSearchResult?storeId=10001&catalogId=10001&langId=-1&panelIDs={FIRM_PAN}$&Type=pbp&nonprinted=&unmapped='>(Additional FEMA Data)</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'FEMA Regulatory Floodplain') {
                        template = new PopupTemplate({
                            title: "Regulatory Floodplain",
                            description: "<b>Layer Name: </b>FEMA Regulatory Floodplain<br><b>Flood Area ID: </b>{FLD_AR_ID}<br><b>Flood Zone: </b>{FLD_ZONE}<br><b>Floodway: </b>{FLOODWAY}" + "<br><b>SFHA_TF: </b>{SFHA_TF}<br><b>STATIC_BFE : </b>{STATIC_BFE}<br><b>Vertical Datum : </b>{V_DATUM}<br><b>Depth : </b>{DEPTH}<br><b>Length Unit : </b>{LEN_UNIT}" + "<br><b>Velocity : </b>{VELOCITY}<br><b>Velocity Unit : </b>{VEL_UNIT}<br><b>AR_REVERT : </b>{AR_REVERT}<br><b>BFE_REVERT : </b>{BFE_REVERT}<br><b>DEP_REVERT : </b>{DEP_REVERT}" + "<br><b>SOURCE_CIT : </b>{SOURCE_CIT}<br><b>HYDRO_ID : </b>{HYDRO_ID}<br><b>CST_MDL_ID : </b>{CST_MDL_ID}<br><b>Year  : </b>{YEAR}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Lewis Wash Floodplain') {
                        template = new PopupTemplate({
                            title: "Lewis Wash",
                            description: "<b>Layer Name: </b>Lewis Wash Floodplain<br><b>ID: </b>{ID}<br><b>Type: </b>{TYPE}"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Non Regulatory Floodplain') {
                        template = new PopupTemplate({
                            title: "Non Reg Floodplain",
                            description: "<b>Layer Name: </b>Non Regulatory Floodplain<br><b>Floodplain Number: </b>{NUM}<br><b>Source: </b>{SOURCE}<br><b>Subdivision: </b>{SUBDIV}" + "<br><b>Date: </b>{DATE}<br><b>Floodplain : </b>{FLOODPLAIN}<br><b>Zone : </b>{ZONE}<br><b>Zone ID : </b>{ZONE_ID}<br><b>Mapkey : </b>{MAPKEY}" + "<br><b>SOURCETHM : </b>{SOURCETHM}<br><b>Area : </b>{AREA}<br><b>Perimeter : </b>{PERIMETER}<br><b>Acres : </b>{ACRES}<br><b>Label : </b>{LABEL}" + "<br><b>All Flood : </b>{ALL_FLOOD}<br><b>Name : </b>{NAME}"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });

            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        engdocs: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var url = "https://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=e";
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    template = new PopupTemplate({
                        title: result.layerName,
                        description: "<b>Name:</b> {Name}<br><b>Prepared By:</b> {Prepared By}<br><b>Date:</b> {Date}<br><b>Type:</b> {Type}<br><b>Project Number:</b> {Project No}" + "<br><b>Document Type:</b> {Document Type}<br><b>Weblink:</b> <a target='_blank' href='https://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=e{Dev Weblink}'>{Dev Weblink}</a>"
                    });
                    feature.setInfoTemplate(template);
                    return feature;
                });
            });

            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

        schools: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template, feature;
                    var name = result.layerName;
                    if (result)
                        feature = result.feature;
                        feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Elementary School' || result.layerName === 'Fruita 8-9 School' || result.layerName === 'High School' || result.layerName === 'Middle School') {
                        template = new PopupTemplate({
                            title: result.layerName + " Boundary",
                            description: "<b>School Name: </b>{NAME}</br><b>Web Site: </b><a href='{URL}'>{URL}</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'School Districts') {
                        template = new PopupTemplate({
                            title: "School Districts",
                            description: "<b>District Name: </b>{NAME}</br><b>Web Site: </b><a href='{URL}'>{URL}</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === 'Cells') {
                        template = new PopupTemplate({
                            title: "School District 51 Cells",
                            description: "<b>Cell Name: </b>{CELL}"
                        });
                        feature.setInfoTemplate(template);
                        } else if (result.layerName === 'School District 51 Board Boundaries') {
                        template = new PopupTemplate({
                            title: "School District 51 Director Districts",
                            description: "<b>Name: </b>{Name}<br><a target='_blank' href='https://connect.d51schools.org/sites/shared/boe/Pages/Board-of-Education-Members.aspx'>Board of Education Members</a>"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });
            aG.map.infoWindow.setFeatures([deferred]);
            aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },


        subList: function (evt, deferred,len, map) {
            map.graphics.clear();
            deferred.addCallback(function (response) {
                var content = '';
                var contentArray, att;
                var GLOurl = "http://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=GL{DOCUMENT_ID}";
                contentArray = array.map(response, function (item) {
                    return item;
                });
                var len = contentArray.length;
                for (i = 0; i < len; i++) {
                    if (contentArray[i].layerName === "Subdivisions") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Subdivision - Click to highlight' class='nored sub' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",13);' " +
                            "></span> " + "<a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber=" + att['Reception Number'] + "'>" + att['Reception Number'] + "</a> " + att['Subdivision Name'] + " - " + att['Recorded Date'] + "<br>";
                    } else if (contentArray[i].layerName === "Deposit Surveys") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Deposit Survey - Click to highlight' class='nored dep' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",15);' " + "></span> " + "<a target='_blank' href='http://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=GD" + att['Deposit Number'] + "'> " + att['Deposit Number'] + "</a> " + att.Title + " - " + att.Date + "<br>";
                    } else if (contentArray[i].layerName === "Historical Surveys") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Historic Survey - Click to highlight' class='nored hist' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",14);' " + "></span> " + "<a target='_blank' href='http://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=GH" + att['HISTORICAL S. WEBLINK'] + "'>" + att['HISTORICAL S. WEBLINK'] + "</a> " + att.NAME + " - " + att.DATE + "<br>";
                    } else if (contentArray[i].layerName === "GLO Plats") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='GLO Survey - Click to highlight' class='nored glo' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",16);' " + "></span> " + "<a target='_blank' href='http://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=GL" + att['GLO WEBLINK'] + "'><b>" + att.NAME + "</b> (GLO Plat)</a><br>";
                    } else if (contentArray[i].layerName === "Deeded ROW") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Deeded ROW - Click to highlight' class='nored deed' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",17);' " + "></span> " + "<a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber=" + att.RECEPTION + "'><b>" + att.ROAD + "</b> (Deeded ROW)</a>";
                    } else if (contentArray[i].layerName === "Dedicated/Platted ROW") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Dedicated/Platted ROW - Click to highlight' class='nored ded' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",18);'></span> " + "<a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber=" + att.Reception + "'><b>" + att['Road Name'] + "</b> (Dedicated/Platted ROW)</a>";
                    } else if (contentArray[i].layerName === "Vacated ROW") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Vacated ROW - Click to highlight' class='nored vac' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",19);' " + "></span> " + "<a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber=" + att.RECEPTION + "'><b>" + att.ROAD + "</b> (Vacated ROW)</a>";
                    } else if (contentArray[i].layerName === "Permanant Easement - ROW") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Permanent Easement ROW - Click to highlight' class='nored ease' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",22);'></span> " + "<a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber=" + att.RECEPTION + "'><b>" + att.ROAD + "</b> (Permanent Easement ROW)</a>";
                    } else if (contentArray[i].layerName === "Road Book/Petitioned ROW") {
                        var bookid = contentArray[i].feature.attributes.OBJECTID;
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Road Book/Petitioned ROW - Click to highlight and expand' class='nored book' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",20,pet" + (att.OBJECTID).toString() + ");'></span> " + "<a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber=" + att.MAP + "'><b>" + att.MAP + "</b> (Road Book/Petitioned ROW)</a><br>" + "<div class='nored' id='pet" + (att.OBJECTID.toString()) + "' style='display:none;'>" + att.RBPG + "<br>" + att.COMMREC + "<br>Reception Number: <a target='_blank' href='https://recording.mesacounty.us/Landmarkweb//search/DocumentBy?ClerkFileNumber=" + att.REC_NO + "'>" + att.REC_NO + "</a>" + "<br>Road Plat 1: " + att.RDPLAT1 + "<br>Survey: " + att.Survey + "</div>";
                    } else if (contentArray[i].layerName === "Road Proclamation 1890 and 1892") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Road Proclamation 1890 and 1892 - Click to highlight' class='nored road' id='i" + att.OBJECTID + "' onclick='getit(" + att.OBJECTID + ",21);'></span> " + "<br>  (Comm. Record " + att.COMM_REC__ + ")<br>" + att.GEN_REC_1 + "<br>  (Gen. Record 1 " + att.DATE_1 + ")<br>" + att.GEN_REC_2 + "<br>  (Gen. Record 2 " + att.DATE_2 + ")<br><br>";
                    } else if (contentArray[i].layerName === "Mesa County Survey Monuments") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Mesa County Survey Monuments' class='nored mon' id='i" + att.OBJECTID + "' onclick='pointit(" + att.OBJECTID + ",2);'></span> " + "Monument Surveyor: " + att.Surveyor + "<br>Date: " + att.Date + "<br>Corner: " + att.Corner + "<br>Monument Record: <a target='_blank' href='http://www.mesacounty.us/gisweb/gisweb.aspx?wci=viewpages&wce=gm" + att['Monument Weblink'] + "'>" + att['Monument Weblink'] + "</a><br><span title='Mesa County Survey Monument'>MCSM</span>: " + att['Mesa County Survey Monument'];
                    } else if (contentArray[i].layerName === "Delta County GPS Monuments/SIMS") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Delta County GPS Monuments/SIMS - Click to expand' class='nored delta' id='i" + att.OBJECTID + "' onclick='pointit(" + att.OBJECTID + ",1);'></span> " + "<b>GPS ID: </b><a target='_blank' href='http://emap.mesacounty.us/DeltaCountyMapping/default.aspx?value=" + att.GPS_ID_Delta + "'>" + att.GPS_ID_Delta + "</a><br><div class='nored collapse' id='" + att.GPS_ID + "' style='display:none;'><b>BLM ID: </b>" + att.BLM_ID_NO + "<br>" + "<b>GPS Precision: </b>" + att.GPS_PRECIS + "<br><b>UTM Northing: </b>" + att.UTM_NORTHI + "<br><b>UTM Easting: </b>" + att.UTM_EASTIN + "<br><b>NAVD88 Elevation: </b>" + att.NAVD88_ELE + "<br><b>Latitude (DMS): </b>" + att.LATITUDE_D + "<br><b>Longitude (DMS): </b>" + att.LONGITUDE_ + "<br><b>Latitude (DD): </b>" + att.LATITUDE_1 + "<br><b>Longitude (DD): </b>" + att.LONGITUDE1 + "<br>" + "<b>HAE: </b>" + att.HAE + "<br><b>Description: </b>" + att.DESCRIPTIO + "</div>";
                    } else if (contentArray[i].layerName === "Mesa County GPS Monuments/SIMS") {
                        att = contentArray[i].feature.attributes;
                        content += "<span title='Mesa County GPS Monuments/SIMS - Click to expand' class='nored mesa' id='i" + att.OBJECTID + "' onclick='pointit(" + att.OBJECTID + ",0," + att.GPS_ID + ");'></span> " + "<b>GPS ID: </b><a target='_blank' href='http://emap.mesacounty.us/SIMS/Default.aspx?value=" + att.GPS_ID + "'>" + att.GPS_ID + "</a><br><div class='nored collapse' id='" + att.GPS_ID + "' style='display:none;'><b>Monument placed: </b>" + att.DATE_ + "<br>   <b>Revised Date: </b>" + att.REVISE_DAT + "<br><b>State Number: </b>" + att.STATE_NO + "<br><b>Former ID: </b>" + att.FORMER_ID + "<br><b>Township: </b>" + att.TNSHP + "<br><b>Range: </b>" + att.RANGE + "<br><b>Prime Meridian: </b>" + att.PM + "<br><b>Code: </b>" + att.CODE + "<br><b>Monument Box: </b>" + att.MON_BOX + "<br><b>MCSM Number: </b>" + att.MCSM_NO + "<br><b>Book: </b>" + att.BOOK + "<br><b>Page: </b>" + att.PAGE + "<br><b>Road Number: </b>" + att.ROAD_NO + "<br><b>Traverse: </b>" + att.TRAVERSE + "<br><b>Trilateration: </b>" + att.TRILATERAT + "<br><b>GPS: </b>" + att.GPS + "<br><b>GPS Method: </b>" + att.GPS_METHOD + "<br><b>Precision: </b>" + att.PRESICION + "<br><b>Lat: </b>" + att.LATITUDE + "<br><b>Lon: </b>" + att.LONGITUDE + "<br><b>Scale: </b>" + att.SCALE + "<br><b>Convergence: </b>" + att.CONVERGENCE + "<br><b>SPC Scale: </b>" + att.SPC_SCALE + "<br><b>SPC CONV: </b>" + att.SPC_CONV + "<br><b>LCS1 Zone: </b>" + att.LCS1_ZONE + "<br><b>Level Method: </b>" + att.METH_LEVEL + "<br><b>Trig Method: </b>" + att.METH_TRIG + "<br><b>GPS Method: </b>" + att.METH_GPS + "<br><b>Ortho Height: </b>" + att.ORTHO_HT + "<br><b>HAE: </b>" + att.HAE + " ft<br><b>NAV 88: </b>" + att.NAVD88_ft_ + " ft<br><b>HT Method: </b>" + att.HT_METHOD + "<br><b>LCS Height: </b>" + att.LCS_HEIGHT + "<br><b>Phot Avail: </b>" + att.PHOTO_AVAI + "<br><b>Poor: </b>" + att.POOR + "<br><b>Fair: </b>" + att.FAIR + "<br><b>Good: </b>" + att.GOOD + "<br><b>Excellent: </b>" + att.EXCELLENT + "<br><b>Comments: </b>" + att.COMMENTS + "<br><b>Point Status: </b>" + att.POINT_STATUS + "<br><b>BLM GCDB ID: </b>" + att.BLM_GCDB_ID + "<br><b>Description: </b>" + att.DESCRIBE_ + "<br><b>Section: </b>" + att.SECTION_ + "<br><b>Type: </b>" + att.TYPE_ + "<br><b>UTM Northing: </b>" + att.UTM_NORTHING + "<br><b>UTM Easting: </b>" + att.UTM_EASTING + "<br><b>SPC Northing: </b>" + att.SPC_NORTHING + "<br><b>SPC Easting: </b>" + att.SPC_EASTING + "<br><b>Zone: </b>" + att._ZONE + "<br><b>LCS Northing: </b>" + att.LCS_NORTHING + "<br><b>LCS Easting: </b>" + att.LCS_EASTING + "<br><b>LCS1 Northing: </b>" + att.LCS1_NORTHING + "<br><b>LCS1 Easting: </b>" + att.LCS1_EASTING + "<br><b>Ellipsoid Height: </b>" + att.ELLIPSOID_HT + "</div>";
                    } else if (contentArray[i].layerName === "Vertical Datum Differences") {
                        att = contentArray[i].feature.attributes;
                        content += "Vertical Datum Difference <br>between NAVD 29 and NAVD 88: +" + att.DIFFERENCE + " meters";
                    } else if (contentArray[i].layerName === "Sections") {
                        att = contentArray[i].feature.attributes;
                        content += "<br><b>" + att.TRSM + "<b>";
                    }
                }


                if (len === 0) {
                    content = "<b style='font-size:1.1em;'>Please turn on a survey layer!</b>";
                }

                if (content !== '') {
                    map.infoWindow.resize(400, 300);
                    map.infoWindow.setTitle("Survey Documents");
                    map.infoWindow.setContent(content);
                } else {
                    map.infoWindow.resize(400, 300);
                    map.infoWindow.setTitle("Survey Documents");
                    map.infoWindow.setContent("No information available");
                }
                map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
            });
        },


        demograph: function (evt, deferred) {
            deferred.addCallback(function (response) {
                return array.map(response, function (result) {
                    var template;
                    var feature = result.feature;
                    feature.attributes.layerName = result.layerName;
                    if (result.layerName === 'Unofficial Zip Codes') {
                        template = new PopupTemplate({
                            title: "Unofficial Zip Codes",
                            description: "5 digit zip code: {ZIPCODE}</br>LSAD: <a target='_blank' href='http://factfinder2.census.gov/help/en/glossary/l/legal_statistical_area_description_code.htm'>{LSAD}</a>"
                        });
                        feature.setInfoTemplate(template);
                    } else if (result.layerName === '2010 US Census Blocks') {
                        template = new PopupTemplate({
                            title: "2010 US Census Blocks",
                            description: "<b>County:</b> {County}<br><b>Place:</b> {Place}<br><b>Tract:</b> {Tract}<br><b>BlockGroup:</b> {Block Group}" + "<br><b>Block:</b> {Block}<br><b>One Race:</b> {ONE_RACE}<br><b>White:</b> {White}<br><b>Black:</b> {Black}<br><b>Native American:</b> " + "{Native American}<br><b>Asian:</b> {Asian}<br><b>Pacific American:</b> {PACF_AM}<br><b>Other Race:</b> {OTHER_RACE}<br><b>Two Races:</b> {TWO_RACES}" + "<br><b>Hispanic Total:</b> {HISP_TOT}<br><b>Hisp_Latin:</b> {HISP_LATIN}<br><b>Housing Unit:</b> {HSING_UNIT}<br><b>Housing Occupancy:</b> {HSING_OCC}" + "<br><b>Vacant Housing:</b> {HSING_VAC}<br><b>More Information:</b> <a target='_blank' href='http://quickfacts.census.gov/qfd/states/08/08077.html'>Census Quick Facts</a>"
                        });
                        feature.setInfoTemplate(template);
                    }
                    return feature;
                });
            });

                aG.map.infoWindow.setFeatures([deferred]);
                aG.map.infoWindow.show(evt.mapPoint, aG.map.getInfoWindowAnchor(evt.screenPoint));
        },

    };//end of return object


});//end define

function getit(objID, layerID, opt) {
    aG.map.graphics.clear();
    var cssID = "#i" + objID.toString();
    require(["dojo/query"], function(query){
    if (query(".nored").style("border", "none"), query(cssID).query({"border-width": "0.1px","border-style": "solid","border-color": "#ff0000"}), opt) {
        var optionID = opt.id;
        document.getElementById(optionID).style.display = document.getElementById(optionID).style.display === "none"? "block": "none";
    }
});
    require(["esri/tasks/query", "esri/tasks/QueryTask", "esri/graphic", "mesa/graphicsTools"], function (Query, QueryTask, Graphic, graphicsTools) {
        var graphicTool = new graphicsTools({
            geometryServiceURL: esriConfig.defaults.geometryService,
            mapRef: aG.map,
        });
        var borderQueryTask = new QueryTask("https://mcgis.mesacounty.us/arcgis/rest/services/maps/eSurveyor/MapServer/" + layerID);
        var borderQuery = new Query();
        borderQuery.returnGeometry = !0, borderQuery.outFields = ["OBJECTID"], borderQuery.where = "OBJECTID = " + objID, borderQueryTask.execute(borderQuery, function (border) {
            aG.map.graphics.add(new Graphic(graphicTool.createJSONPolygon(border.features[0].geometry.rings)));
        });
    });
}

function pointit(objID, layerID, opt) {
    aG.map.graphics.clear();
    var cssID = "#i" + objID.toString();
    require(["dojo/query"], function(query){
    query(".nored").style("border", "none");
    query(cssID).style({
        "border-width": "0.1px",
        "border-style": "solid",
        "border-color": "#ff0000"
    });
});
    // var optionID = opt.id;
    // document.getElementById(optionID).style.display = document.getElementById(optionID).style.display === "none"? "block": "none";
}

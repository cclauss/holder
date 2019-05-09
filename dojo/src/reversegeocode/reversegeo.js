

// api for and base url for fetching geocoding service
var apikey = 'c95e0cb3a9b24242ba5ebd6eed307c59';
var api_url = 'https://api.opencagedata.com/geocode/v1/json?key='

// api and base url for fetching weather data
var weather_api = 'f2bb4b57ac5f169e6d6d002bb77fe357';
var base_url_weather = 'https://api.openweathermap.org/data/2.5/forecast?&q=';

define([
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",

    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",

    // load template    
    "dojo/text!app/reversegeocode/templates/reversegeoWidget.html",

    "dojo/dom-class",
    "dojo/dom-style", "esri/geometry/webMercatorUtils", "dojo/number"
], function (
    _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
    Evented, declare, lang,
    on,
    widgetTemplate,
    domClass, domStyle, WebMercatorUtils, number, esriRequest, esriConfig) {

        return declare([_WidgetBase, _TemplatedMixin], {
            name: "Reverse Geo Widget",
            templateString: widgetTemplate,
            baseClass: "reversegeoWidget",
            options: {
                map: null
            },
            constructor: function (options, srcRefNode) {
                var Widget = this;
                // mix in settings and defaults
                declare.safeMixin(this.options, options);
                this.domNode = srcRefNode;
                this.set("map", this.options.map);

                // function to get the name of city through reverse geo-coding
                this.get_city = async function (url_) {
                    try {
                        console.log('Hello there from try');
                        var response = await fetch(url_);
                        var JSONparsed = await response.json();
                        var cityName = await JSONparsed.results[0].components.city;
                        return cityName;
                    } catch (er) {
                        console.log(er);
                    }
                };

                //function for weather service through open weather using async await
                // this.testing = async function (_url) {
                //     try {
                //         console.log('from testing function');
                //         const response = await fetch(_url);
                //         const data = await response.json();
                //         return data;
                //     } catch (err) {
                //         console.log(err);
                //     }
                // };

                // same above function for weather service through open weather using inbuilt fetch api
                // this.testing = function (_url) {
                //     return fetch(_url).then(function(data){
                //         return data.json();
                //     })
                // }


                // on click event handler
                if (this.map) {
                    this.map.on("click", function (e) {

                        // //Convert from WebMercator to WGS84 (from XY to long and lat)
                        var wgs84Coords = WebMercatorUtils.webMercatorToGeographic(e.mapPoint);
                        var lat = wgs84Coords.y.toFixed(3);
                        var long = wgs84Coords.x.toFixed(3);

                        console.log(lat,long);
                        // calling the geocoding method and displaying
                        var url_test = api_url + apikey + '&q=' + lat + ',' + long + '&pretty=1';
                        Widget.get_city(url_test).then(data => {
                            console.log('data geocode',data);
                            if (data != undefined) { 
                                dojo.query("#spanLocation", Widget.domNode)[0].innerHTML = "<div>" + data + "</div>";
                                //var weather_url = base_url_weather + data + '&units=metric&cnt=15&appid=' + weather_api;

                                // calling the function to fetch weather data
                                // Widget.testing(weather_url).then(weather => {
                                //     var html = "";
                                //         html += data;
                                //         if (weather == undefined) {
                                //             console.log('nicht datum')
                                //         } else {
                                //               weather.list.forEach(item=>{
                                //               var date = item.dt_txt;
                                //                 var temp = item.main.temp;
                                //                 var pressure = item.main.pressure;
                                //                 var humidity = item.main.humidity;
                                //               html += "<div><span>"+date+"</span><br>"+"<span>"+temp+"</span></div>"
                                //          })
                                //         }
                                //     dojo.query("#spanLocation", Widget.domNode)[0].innerHTML = html;
                                // });
                            } else {
                                dojo.query("#spanLocation", Widget.domNode)[0].innerHTML = "<div>" + 'Location not found!' + "</div>";
                            }
                        });
                    });
                }

                this.set("visible", this.options.visible);
                this.watch("visible", this._visible);

                // classes
                this._css = {
                    widget: "reversgeoWidget",
                    container: "reversegeoWidgetContainer",
                    home: "reversegeoWidgetHome",
                    location: "reversegeoWidgetLocation",
                    title: "reversegeoWidgetTitle"
                };
            }
        });

    });



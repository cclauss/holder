define([
   "dijit/_WidgetBase",
   "dijit/_OnDijitClickMixin", 
   "dijit/_TemplatedMixin",
 
   "dojo/Evented",
   "dojo/_base/declare",
 "dojo/_base/lang",
   "dojo/on",
 
   // load template    
   "dojo/text!coordinate/templates/CoordinateWidget.html",
 
   "dojo/dom-class",
   "dojo/dom-style", "esri/geometry/webMercatorUtils", "dojo/number"
 ], function (
    _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
    Evented, declare, lang,
    on,
    widgetTemplate,
    domClass, domStyle, WebMercatorUtils, number) {
    return declare([_WidgetBase, _TemplatedMixin], {
       name: "Coordinates Widget",
       templateString: widgetTemplate,
       baseClass: "coordinateWidget",
       options: {
          map: null
       },
       constructor: function (options, srcRefNode) {
          var Widget = this;
          // mix in settings and defaults
          declare.safeMixin(this.options, options);
          this.domNode = srcRefNode;
          this.set("map", this.options.map);
          if (this.map) {
             this.map.on("click", function (e) {
                //Convert from WebMercator to WGS84 (from XY to long and lat)
                var wgs84Coords = WebMercatorUtils.webMercatorToGeographic(e.mapPoint);
                //Place calculated coordinates inside the spans after rounding to 3 digits after decimal point
                dojo.query("#spanLatitude", Widget.domNode)[0].innerHTML = (wgs84Coords.y.toFixed(3));
                dojo.query("#spanLongitude", Widget.domNode)[0].innerHTML = (wgs84Coords.x.toFixed(3));
             });
          }
          this.set("visible", this.options.visible);
          this.watch("visible", this._visible);
          // classes
          this._css = {
             widget: "coordinteWidget",
             container: "coordinateWidgetContainer",
             home: "coordinateWidgetHome",
             coordinate: "coordinateWidgetCoordinate",
             title: "coordinateWidgetTitle"
          };
       }
    });
 
 });



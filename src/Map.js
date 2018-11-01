import React, { Component } from 'react';
import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import Point from 'ol/geom/Point.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import './Map.css';

class Map1 extends Component{
    componentDidMount()
       {
        let positionFeature = new Feature();
          positionFeature.setStyle(new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: '#3399CC'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2
              })
            })
          }));
       let view1= new View({
            center:[0,0],
            zoom:2
           })
     let map = new Map({
     	layers:[
     	new TileLayer({
     		source:new OSM()
     	})
     	],
     	target:'map',
     	view:view1 
     });   
     let geolocation = new Geolocation({
         trackingOptions: {
             enableHighAccuracy: true
            },
          projection: view1.getProjection()
       })
     function el(id) {
        return document.getElementById(id);
      }

      el('track').addEventListener('change', function() {
        geolocation.setTracking(this.checked);
      });
         geolocation.on('change', function() {
        el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
        el('altitude').innerText = geolocation.getAltitude() + ' [m]';
        el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
        el('heading').innerText = geolocation.getHeading() + ' [rad]';
        el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
      });
         geolocation.on('error', function(error) {
            let info = document.getElementById('info');
            info.innerHTML = error.message;
            info.style.display = '';
          });
        let accuracyFeature = new Feature();
          geolocation.on('change:accuracyGeometry', function() {
            accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
          });
       geolocation.on('change:position', function() {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ?
          new Point(coordinates) : null);
      });
       new VectorLayer({
          map: map,
           source: new VectorSource({
           features: [accuracyFeature, positionFeature]
        })
      });
    }
    render() {
    return (   
    <div>
       <div id="map" className="map">
       </div>
       <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css"/>
       <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
       <div id="info"></div>
       <label>
       track position
       <input id="track" type="checkbox"/>
       </label>
       <p>
         position accuracy : <code id="accuracy"></code><br/>
         altitude : <code id="altitude"></code><br/>
         altitude accuracy : <code id="altitudeAccuracy"></code><br/>
         heading : <code id="heading"></code><br/>
         speed : <code id="speed"></code>
       </p>
    </div>
    );
  }
}
export default Map1

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { loadModules } from 'esri-loader';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RequestDetail, RequestLocation } from '../../../classes/request';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { LocationMapDialog } from '../../../components/modals/dialog-location/dialog-location';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  request_id:number;
  status_id:number;
  role_id:number;
  category_id:number;
  hide:boolean = true;
  map: any;
  tempGraphicsLayer:any;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   public dialog: MatDialog) {}

  ngOnInit() {
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.status_id = data.requestDetail.generalInfo.status_id;
          this.category_id = data.requestDetail.generalInfo.category_id;
          //this.setLayout();
        });
    this.authService.unlocked.subscribe(unlocked => { this.setLayout(unlocked); });

    loadModules([
      'esri/Map',
      'esri/Basemap',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/layers/TileLayer',
      'esri/layers/GraphicsLayer',
      'esri/layers/FeatureLayer',
      'esri/widgets/Track'
      ])
      .then(([Map,Basemap, MapView, Graphic, Point, TileLayer, GraphicsLayer, FeatureLayer, Track]) => {
        this.tempGraphicsLayer = new GraphicsLayer();
        let ptFeatureLayer = new FeatureLayer({
          url: this.authService.appSettings.pt_feature_layer,
          outFields: ["*"],
          visible: false
        });
        let polyFeatureLayer = new FeatureLayer({
          url: this.authService.appSettings.poly_feature_layer,
          outFields: ["*"],
          visible: false
        });

        var baseLayer = new TileLayer({
            url: this.authService.appSettings.base_layer,
            id: "streets",
            visibility: true
        });

        this.map = new Map({
          basemap: new Basemap({
            baseLayers: [baseLayer]
          })
        });
        /*this.map = new Map({
                basemap: 'streets'
              });*/
        this.map.add(ptFeatureLayer);
        this.map.add(polyFeatureLayer);
        this.map.add(this.tempGraphicsLayer);
        let view = new MapView({
              container: "mapDiv",
              map: this.map,
              zoom: 10,
              center: [-76.6, 39.2]
            });
        let track = new Track({
            view: view
          });
        view.ui.add(track, "bottom-left");
        let requestId = this.request_id;
          view.whenLayerView(ptFeatureLayer).then(function(layerView){
           let query = ptFeatureLayer.createQuery();
           query.where = "REQUEST_ID = " + requestId;
           ptFeatureLayer.queryFeatures(query).then(function(result){
             if(result.features.length > 0){
                // center the feature
                let features = result.features.map(function(graphic) {
                  graphic.symbol = {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    style: "diamond",
                    size: 10,
                    color: "darkorange"
                  };
                  return graphic;
                });
                this.tempGraphicsLayer.addMany(features);
                /*view.goTo({
                   target: result.features,
                   zoom: 10
                 });*/
             }
           })
          });
          view.whenLayerView(polyFeatureLayer).then(function(layerView){
           let query = polyFeatureLayer.createQuery();
           query.where = "REQUEST_ID = " + requestId;
           polyFeatureLayer.queryFeatures(query).then(function(result){
             if(result.features.length > 0){
                // center the feature
                let features = result.features.map(function(graphic) {
                  graphic.symbol = {
                    type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                    color: "darkorange",
                    style: "solid",
                    outline: {  // autocasts as new SimpleLineSymbol()
                      color: "gray",
                      width: 1
                    }
                  };
                  return graphic;
                });
                this.tempGraphicsLayer.addMany(features);
                /*view.goTo({
                   target: result.features,
                   zoom: 10
                 });*/
             }
           })
          });

          view.whenLayerView(this.tempGraphicsLayer).then(function(layerView){
            console.log(this.tempGraphicsLayer.graphics.items);
            /*if(tempGraphicsLayer.graphics.items.length > 0){
              view.goTo({
                 target: tempGraphicsLayer.graphics.items,
                 zoom: 20
               });
            }*/
          });
      })
  }
  openLocationDialog() {
    const dialogRef = this.dialog.open(LocationMapDialog, { data: { graphics: this.map.layers.items[2].graphics.items, baselayer: this.authService.appSettings.base_layer }, width: '900px', height: '700px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        document.querySelector("body").style.cssText = "cursor: wait";
        let new_points:RequestLocation[] = [];
        let new_polygons:RequestLocation[] = [];
          for(let g of result){
            let new_location = new RequestLocation();
            new_location.request_id = this.request_id;
            new_location.shape = this.convertGeometryToString(g);
            if(g.geometry.type == "point"){
              new_points.push(new_location);
            }
            else if(g.geometry.type == "polygon"){
              new_polygons.push(new_location);
            }
          }
          this.requestService.updateLocationPt(new_points, this.request_id).subscribe(result => {
            if(result){
              document.querySelector("body").style.cssText = "cursor: auto";
              console.log(result);
              // First create a point geometry (this is the location of the Titanic)
              /*var point = {
                type: "point", // autocasts as new Point()
                longitude: -49.97,
                latitude: 41.73
              };

              // Create a symbol for drawing the point
              var markerSymbol = {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [226, 119, 40],
                outline: { // autocasts as new SimpleLineSymbol()
                  color: [255, 255, 255],
                  width: 2
                }
              };
              // Create a graphic and add the geometry and symbol to it
              var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
              });
              this.tempGraphicsLayer.add(pointGraphic);*/
            }
            //console.log(result);
              //location.reload();
          });
          this.requestService.updateLocationPoly(new_polygons, this.request_id).subscribe(result => {
            if(result){
              document.querySelector("body").style.cssText = "cursor: auto";
              console.log(result);
            }
              //
              //location.reload();
          });
      }
    });
  }

  setLayout(unlocked:boolean){
    if(this.role_id == 1){
      if(this.status_id == 1  || unlocked){
        this.hide = false;
      }
    }
    else if(this.role_id == 2){
      if(this.status_id == 2 || this.status_id == 3){
        this.hide = false;
      }
    }

  }

  convertGeometryToString(graphic:any):string{
    let result:string = "";
        let g = graphic.geometry;
        if(g.type == "point"){
  				result += g.x + " ";
  				result += g.y + ",";
  				result = "POINT ( " + result.substr(0, result.length-1) + " )"; //Remove last comma separator
  			}
        if(g.type == "polygon"){
          if (g.rings.length < 1) {
					return "";
				}
				//Cycle through the first polygon ring to gather point coordinates
				for(let ring of g.rings){
					let ringString:string = "";
					for(let mp of ring) {
						ringString += mp[0] + " ";
						ringString += mp[1] + ",";
					}
					ringString = "( " + ringString.substr(0, ringString.length-1) + " )" + ",";//Remove last comma separator
					result += ringString;
				}
				result = "POLYGON ( " + result.substr(0, result.length-1) + " )"; //Remove last comma separator
        }
    return result;
  }


}
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
  canEdit:boolean;
  //tempGraphicsLayer:any;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   public dialog: MatDialog) {}

  ngOnInit() {
    this.canEdit = this.route.snapshot.queryParams["canEdit"] == "true";
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
      'esri/geometry/Extent',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/layers/TileLayer',
      'esri/layers/GraphicsLayer',
      'esri/layers/FeatureLayer',
      'esri/widgets/Track'
      ])
      .then(([Map,Basemap, MapView, Extent, Graphic, Point, TileLayer, GraphicsLayer, FeatureLayer, Track]) => {
        let tempGraphicsLayer = new GraphicsLayer();
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
        //this.map.add(ptFeatureLayer);
        //this.map.add(polyFeatureLayer);
        this.map.add(tempGraphicsLayer);
        let view = new MapView({
              container: "mapDiv",
              map: this.map,
              extent: new Extent({
                xmin: -8539123.785019355,
                ymin: 4744524.243404276,
                xmax: -8502819.196583943,
                ymax: 4767531.788918083,
                spatialReference: {
                  wkid: 102100
                }
              })
            });
        let track = new Track({
            view: view
          });
        view.ui.add(track, "bottom-left");
        let requestId = this.request_id;

        let query1 = ptFeatureLayer.createQuery();
        query1.where = "REQUEST_ID = " + requestId;

        let query2 = polyFeatureLayer.createQuery();
        query2.where = "REQUEST_ID = " + requestId;

        //let promise0 = view.whenLayerView(tempGraphicsLayer);
        let promise1 = ptFeatureLayer.queryFeatures(query1);
        let promise2 = polyFeatureLayer.queryFeatures(query2);

        Promise.all([promise1, promise2]).then(function(values) {
            let newExtent = new Extent();
            if(values[0].features.length > 0){
               // center the feature
               let features = values[0].features.map(function(graphic) {
                 graphic.symbol = {
                   type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                   //style: "diamond",
                   size: 16,
                   color: [0, 112, 255],
                   outline: {  // autocasts as new SimpleLineSymbol()
                       width: 0  // points
                     }
                 };
                 return graphic;
               });
               tempGraphicsLayer.addMany(features);
            }
            if(values[1].features.length > 0){
               // center the feature
               let features = values[1].features.map(function(graphic) {
                 graphic.symbol = {
                   type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                   color: [0, 112, 255],
                   style: "none",
                   outline: {  // autocasts as new SimpleLineSymbol()
                     color: [0, 112, 255],
                     width: 2
                   }
                 };
                 return graphic;
               });
               tempGraphicsLayer.addMany(features);
            }
            view.goTo(tempGraphicsLayer.graphics);
        });
      })
  }
  openLocationDialog() {
    const dialogRef = this.dialog.open(LocationMapDialog, { data: { graphics: this.map.layers.items[0].graphics.items, baselayer: this.authService.appSettings.base_layer }, width: '900px', height: '700px'});
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
              location.reload();
          });
          this.requestService.updateLocationPoly(new_polygons, this.request_id).subscribe(result => {
            if(result){
              document.querySelector("body").style.cssText = "cursor: auto";
              console.log(result);
              location.reload();
            }
              //
              //
          });
      }
    });
  }

  setLayout(unlocked:boolean){
    if(this.role_id == 1 && this.canEdit){
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

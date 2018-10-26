import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { map, Map, tileLayer, LatLng } from "leaflet";
import { GamePlayManagerService } from "src/app/services";
import { Segment } from "src/app/types";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";



@Component({
  selector: "app-map",
	templateUrl: "./map.component.html",
	styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  private _mapController: Map;
  @ViewChild("map")
	_mapEl: ElementRef;
  
	constructor(
    private gamePlayManager: GamePlayManagerService,) {
      gamePlayManager.locationSubject.subscribe({
        next: this._renderLocations
      })
      gamePlayManager.segmentSubject.subscribe({
        next: this._renderSegments
      })
    }
  
	ngOnInit() {
  }
  
  ngAfterViewInit() {
    this._initMap();
  }
  
  private _initMap(): void {
    const hbllLocation: LatLng = new LatLng(40.248157, -111.649150);
    const defaultZoomLevel: number = 16;
    const maxZoom: number = 18;
    this._mapController = map(this._mapEl.nativeElement).setView(hbllLocation, defaultZoomLevel);
    tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      detectRetina: true,
      maxZoom,
    }).addTo(this._mapController);
    this.gamePlayManager.getMapData();
  }

  private _renderLocations(locations: Location[]) {
    console.log('Rendering locations');
  }

  private _renderSegments(segments: Segment[]) {
    console.log('Rendering segments');
  }
}

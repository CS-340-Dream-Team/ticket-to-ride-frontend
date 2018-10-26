import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { map, Map, tileLayer, LatLng, marker, latLng, Icon, icon, polyline, point, PolylineOptions, LatLngExpression } from "leaflet";
import { GamePlayManagerService } from "src/app/services";
import { Segment, Location as MapLocation, BusColor } from "src/app/types";

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
        next: (locations) => this._renderLocations(locations)
      })
      gamePlayManager.segmentSubject.subscribe({
        next: (segments) => this._renderSegments(segments)
      })
    }
  
	ngOnInit() {
  }
  
  ngAfterViewInit() {
    this._initMap();
  }
  
  private _claimSegment(segment: Segment) {
    this.gamePlayManager.claimSegment(segment);
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

  private _renderLocations(locations: MapLocation[]) {
    const pin: Icon = icon({
      iconUrl: '../../../assets/images/pin.png',
      iconSize: [22, 29.5]
    });
    for (const location of locations) {
      const { lat, long } : { lat: number, long: number } = location.latLong;
      marker(latLng(lat, long), { 
        title: location.name,
        icon: pin
      }).addTo(this._mapController)
      .bindTooltip(location.name, {
        direction: 'top',
        offset: point(0, -20)
      });
    }
  }

  private _renderSegments(segments: Segment[]) {
    console.log('Rendering segments');
    for (const segment of segments) {
      const { start, end } : { start: MapLocation, end: MapLocation } = segment;
      const line: LatLngExpression[] = [ 
        latLng(start.latLong.lat, start.latLong.long), 
        latLng(end.latLong.lat, end.latLong.long) 
      ];
      let toolTip: string = `Length: ${segment.length}`;
      const options: PolylineOptions = {
        color: segment.color.toString() === 'any' ? 'grey' : segment.color.toString(),
        opacity: 1,
        stroke: true,
      }
      if (segment.pair) {
        options.weight = 6;
        toolTip += ', Double Path';
        if (segment.owner === undefined && segment.pair.owner) {
          toolTip += `, Half Claimed by ${segment.pair.owner.name}`;
          options.opacity = 0.5;
        } else if (segment.owner && segment.pair.owner === undefined) {
          toolTip += `, Half Claimed by ${segment.owner.name}`;
          options.opacity = 0.5;
        } else if (segment.owner && segment.pair.owner) {
          toolTip += `, Claimed by ${segment.owner.name} & ${segment.pair.owner.name}`;
          options.opacity = 0.5;
        }
      }
      if (segment.pair === undefined && segment.owner) {
        toolTip += `, Claimed by ${segment.owner.name}`;
        options.opacity = 0.5;
      }
      polyline(line, options)
        .addTo(this._mapController)
        .bindTooltip(toolTip)
        .on('dblclick', () => {
          this._claimSegment(segment);
        });
    }
  }
}
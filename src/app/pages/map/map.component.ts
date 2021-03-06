import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
	map,
	Map,
	tileLayer,
	LatLng,
	marker,
	latLng,
	Icon,
	icon,
	polyline,
	point,
	PolylineOptions,
	LatLngExpression,
	Polyline,
	Layer,
	Tooltip,
} from "leaflet";
import { GamePlayManagerService } from "src/app/services";
import { Segment, Location as MapLocation, BusColor, PlayerColor } from "src/app/types";
import { LineString, MultiLineString } from "geojson";
import "leaflet-polylineoffset";
import { ChatManagerService } from "src/app/services/chat-manager/chat-manager.service";

@Component({
	selector: "app-map",
	templateUrl: "./map.component.html",
	styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
	private _mapController: Map;
	@ViewChild("map")
	_mapEl: ElementRef;
	_markers: any = {};
	_segments: Polyline<LineString | MultiLineString, any>[] = [];
	_outlines: Polyline<LineString | MultiLineString, any>[] = [];

	constructor(
		private gamePlayManager: GamePlayManagerService,
		private chatManager: ChatManagerService
	) {
		gamePlayManager.locationSubject.subscribe({
			next: locations => this._renderLocations(locations),
		});
		gamePlayManager.segmentSubject.subscribe({
			next: segments => {
				this._renderSegments(segments);
			},
		});
		gamePlayManager.getFullGame();
		gamePlayManager.startPolling();
		chatManager.startPolling();
	}

	ngOnInit() {}

	ngAfterViewInit() {
		this._initMap();
	}

	private _claimSegment(segment: Segment) {
		this.gamePlayManager.openClaimSegmentModal(segment);
	}
	private _constructOutline(segment: Segment): Polyline<LineString | MultiLineString, any> {
		if (!segment.owner) {
			const { start, end }: { start: MapLocation; end: MapLocation } = segment;
			const line: LatLngExpression[] = [
				latLng(start.latLong.lat, start.latLong.long),
				latLng(end.latLong.lat, end.latLong.long),
			];
			const options: PolylineOptions = {
				color: "black",
				opacity: 1,
				stroke: true,
				weight: 3.5,
			};
			const leafletLine: Polyline<LineString | MultiLineString, any> = polyline(line, options);
			return leafletLine;
		}
	}
	private _constructLine(
		segment: Segment
	): { line: Polyline<LineString | MultiLineString, any>; toolTip: string } {
		const { start, end }: { start: MapLocation; end: MapLocation } = segment;
		const line: LatLngExpression[] = [
			latLng(start.latLong.lat, start.latLong.long),
			latLng(end.latLong.lat, end.latLong.long),
		];
		let toolTip: string = `Length: ${segment.length}`;
		const options: PolylineOptions = {
			color: segment.color === BusColor.Rainbow ? "grey" : BusColor[segment.color].toLowerCase(),
			opacity: 1,
			stroke: true,
		};
		if (segment.owner) {
			toolTip += `, Claimed by ${segment.owner.name}`;
			options.dashArray = "10,10";
			options.color = this._playerColorToString(segment.owner.color);
		}
		const leafletLine: Polyline<LineString | MultiLineString, any> = polyline(line, options);
		return { line: leafletLine, toolTip };
	}
	private _playerColorToString(playerColor: PlayerColor): string {
		let pc_map = {
			0: "grey",
			1: "red",
			2: "green",
			3: "blue",
			4: "yellow",
			5: "black",
		};
		return pc_map[playerColor];
	}
	private _initMap(): void {
		const hbllLocation: LatLng = new LatLng(40.248157, -111.64915);
		const defaultZoomLevel: number = 16;
		const maxZoom: number = 18;
		this._mapController = map(this._mapEl.nativeElement).setView(hbllLocation, defaultZoomLevel);
		tileLayer(
			"https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
			{
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
				subdomains: "abcd",
				detectRetina: true,
				maxZoom,
			}
		).addTo(this._mapController);
	}

	private _renderLocations(locations: MapLocation[]) {
		const pin: Icon = icon({
			iconUrl: "../../../assets/images/pin.png",
			iconSize: [22, 29.5],
		});
		for (const location of locations) {
			const { lat, long }: { lat: number; long: number } = location.latLong;
			marker(latLng(lat, long), {
				title: location.name,
				icon: pin,
			})
				.addTo(this._mapController)
				.bindTooltip(location.name, {
					sticky: true,
					direction: "top",
					offset: point(0, -20),
				});
		}
	}

	private _renderSegments(segments: Segment[]): void {
		this._removeSegments();
		segments.forEach((segment: Segment, index: number) => {
			const outline = this._constructOutline(segment);
			const { line, toolTip } = this._constructLine(segment);

			this._segments.push(line);
			if (outline) {
				this._outlines.push(outline);
				if (segment.pair && segment.pair <= index + 1 && outline) {
					(<any>outline).setOffset(5);
					outline.addTo(this._mapController);
				} else {
					outline.addTo(this._mapController);
				}
			}

			line
				.addTo(this._mapController)
				.bindTooltip(toolTip)
				.on("click", () => {
					this._claimSegment(segment);
				});
			if (segment.pair && segment.pair <= index + 1) {
				(<any>line).setOffset(5);
			}
		});
	}

	private _removeSegments(): void {
		while (this._segments.length > 0) {
			const segment: Polyline<LineString | MultiLineString, any> = this._segments.pop();
			segment.remove();
		}
		while (this._outlines.length > 0) {
			const outline: Polyline<LineString | MultiLineString, any> = this._outlines.pop();
			outline.remove();
		}
	}
}

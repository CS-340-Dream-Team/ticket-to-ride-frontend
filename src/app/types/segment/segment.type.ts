import { Location } from "../location/location.type";
import { Player } from "../player/player.type";
import { BusColor } from "../bus-color/bus-color.type";

export interface Segment {
	id: number;
	start: Location;
	end: Location;
	color: BusColor;
	length: number;
	owner?: Player;
	pair?: number;
}

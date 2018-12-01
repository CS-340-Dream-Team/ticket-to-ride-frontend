import { BusCard } from "../types/bus-card/bus-card.type";
import { BusColor } from "../types/bus-color/bus-color.type";

export default function getPlayerCardCounts(
	busCards: BusCard[]
): {
	red: number;
	orange: number;
	yellow: number;
	green: number;
	blue: number;
	purple: number;
	black: number;
	white: number;
	rainbow: number;
} {
	const busCardCounts = {
		red: 0,
		orange: 0,
		yellow: 0,
		green: 0,
		blue: 0,
		purple: 0,
		black: 0,
		white: 0,
		rainbow: 0,
	};
	busCardCounts.red = busCards.filter(card => card.color === BusColor.Red).length;
	busCardCounts.orange = busCards.filter(card => card.color === BusColor.Orange).length;
	busCardCounts.yellow = busCards.filter(card => card.color === BusColor.Yellow).length;
	busCardCounts.green = busCards.filter(card => card.color === BusColor.Green).length;
	busCardCounts.blue = busCards.filter(card => card.color === BusColor.Blue).length;
	busCardCounts.purple = busCards.filter(card => card.color === BusColor.Purple).length;
	busCardCounts.black = busCards.filter(card => card.color === BusColor.Black).length;
	busCardCounts.white = busCards.filter(card => card.color === BusColor.White).length;
	busCardCounts.rainbow = busCards.filter(card => card.color === BusColor.Rainbow).length;

	return busCardCounts;
}

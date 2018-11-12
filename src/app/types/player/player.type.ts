import { PlayerColor } from "../PlayerColor/PlayerColor";
import { BusCard, Route } from "..";

export interface Player {
    name:string;
    color: PlayerColor;
    points: number;
    busPieces: number;
    busCards: BusCard[] | number; //BusCard[] if client player, number if opponent player
    routeCards: Route[] | number; //same idea as above
    routeCardBuffer?: Route[];
}
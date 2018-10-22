import { Location } from '../location/location.type';
import {Player} from '../player/player.type';

export interface Segment {
    start: Location;
    end: Location;
    length: number;
    owner: Player|null;
    pair: Segment|null;
}

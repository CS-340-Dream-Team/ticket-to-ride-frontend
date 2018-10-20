import { Location } from '../location/location.type';

export interface Route {
    name: string;
    start: Location;
    end: Location;
    points: number;
}

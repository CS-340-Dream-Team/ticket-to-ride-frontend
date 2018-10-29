import { Component, OnInit } from '@angular/core';
import { Route } from '../../../types';
import { GamePlayManagerService } from '../../../services';


@Component({
  selector: 'app-route-selector',
  templateUrl: './route-selector.component.html',
  styleUrls: ['./route-selector.component.scss']
})
export class RouteSelectorComponent implements OnInit {

  constructor(private gamePlayManager: GamePlayManagerService) { 
    console.log('Created the Route Selector');
  }

  public routes: Route[];
  public selections: RouteSelection[];

  ngOnInit() {
    // FIXME Ping the server to get this stuff
    this.routes = [
      {
        'name': 'Gains \'n\' Grades',
        'points': 4,
        'start': {
           'name': 'The Testing Center',
           'latLong': {
              'lat': 40.245433,
              'long': -111.652399
           }
        },
        'end': {
           'name': 'Vasa',
           'latLong': {
              'lat': 40.240334,
              'long': -111.642054
           }
        }
     },
     {
        'name': 'America\'s Passtime',
        'points': 5,
        'start': {
           'name': 'J-Dawgs',
           'latLong': {
              'lat': 40.245286,
              'long': -111.646318
           }
        },
        'end': {
           'name': 'Baseball Stadium',
           'latLong': {
              'lat': 40.254821,
              'long': -111.651125
           }
        }
     },
     {
        'name': 'Comfort Food',
        'points': 6,
        'start': {
           'name': 'DMV',
           'latLong': {
              'lat': 40.233169,
              'long': -111.656048
           }
        },
        'end': {
           'name': 'Chip Cookie',
           'latLong': {
              'lat': 40.24028,
              'long': -111.661463
           }
        }
     }
    ];
    this.selections = [];
    this.routes.forEach(route => {
      this.selections.push({route: route, selected: true});
    });
  }

  selectRoute(route: RouteSelection) {
    route.selected = !route.selected;
  }

  numSelected() {
    let numSelected = 0;
    this.selections.forEach(route => {
      if (route.selected) {
        numSelected += 1;
      }
    });
    return numSelected;
  }

  submitButtonText() {
    const numSelected = this.numSelected();
    if (numSelected <= 1) {
      return 'You must keep at least 2 routes';
    }
    return `Keep ${numSelected} route` + (numSelected === 1 ? '' : 's');
  }

  makeFinalSelection() {
    const finalRoutes = [];
    const rejectedRoutes = [];
    this.selections.forEach(route => {
      if (route.selected) {
        finalRoutes.push(route.route);
      } else {
        rejectedRoutes.push(route.route);
      }
    });
    this.gamePlayManager.selectRoutes(finalRoutes, rejectedRoutes);
  }
 }

interface RouteSelection {
  route: Route;
  selected: boolean;
}

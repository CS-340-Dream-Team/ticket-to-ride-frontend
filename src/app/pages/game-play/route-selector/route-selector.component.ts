import { Component, OnInit, Input } from "@angular/core";
import { Route } from "../../../types";
import { GamePlayManagerService } from "../../../services";

@Component({
	selector: "app-route-selector",
	templateUrl: "./route-selector.component.html",
	styleUrls: ["./route-selector.component.scss"],
})
export class RouteSelectorComponent implements OnInit {
	constructor(private gamePlayManager: GamePlayManagerService) {
		gamePlayManager.selectingRoutesSubject.subscribe({
			next: selectingRoutes => {
				this.selectingRoutes = selectingRoutes;
				this.minNumber = this.gamePlayManager.getMinRoutesNumber();
				if (selectingRoutes) {
					this.routes = this.gamePlayManager.clientPlayer.routeCardBuffer;
					this.selections = [];
					this.routes.forEach(route => {
						this.selections.push({ route: route, selected: true });
					});
				}
			},
		});
	}

	private selectingRoutes = false;
	public minNumber: number;
	public routes: Route[];
	public selections: RouteSelection[] = [];

	ngOnInit() {}

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
		if (numSelected < this.minNumber) {
			return `You must keep at least ${this.minNumber} routes`;
		}
		return `Keep ${numSelected} route` + (numSelected === 1 ? "" : "s");
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

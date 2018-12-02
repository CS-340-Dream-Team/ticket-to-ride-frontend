import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HttpModule } from "@angular/http";

import { Game } from "../../../types";

import { ListedGameComponent } from "./listed-game.component";

describe("ListedGameComponent", () => {
	let component: ListedGameComponent;
	let fixture: ComponentFixture<ListedGameComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ListedGameComponent],
			imports: [HttpModule],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ListedGameComponent);
		component = fixture.componentInstance;
		const game: Game = {
			playersJoined: [],
			host: { name: "Andrew Tate", color: 1 },
			name: "New Game",
			numPlayers: 3,
			id: 1,
		};
		component.game = game;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});

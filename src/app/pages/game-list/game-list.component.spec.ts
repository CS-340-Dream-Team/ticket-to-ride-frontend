import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HttpModule } from "@angular/http";
import { GameListManagerService } from "../../services";
import { GameListComponent } from "./game-list.component";
import { CreateGameDialogComponent } from "./create-game-dialog/create-game-dialog.component";
import { ListedGameComponent } from "./listed-game/listed-game.component";

describe("GameListComponent", () => {
	let component: GameListComponent;
	let fixture: ComponentFixture<GameListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GameListComponent, CreateGameDialogComponent, ListedGameComponent],
			imports: [HttpModule],
			providers: [GameListManagerService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GameListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});

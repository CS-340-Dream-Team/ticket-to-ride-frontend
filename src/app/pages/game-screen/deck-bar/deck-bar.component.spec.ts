import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DeckBarComponent } from "./deck-bar.component";

describe("DeckBarComponent", () => {
	let component: DeckBarComponent;
	let fixture: ComponentFixture<DeckBarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeckBarComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeckBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});

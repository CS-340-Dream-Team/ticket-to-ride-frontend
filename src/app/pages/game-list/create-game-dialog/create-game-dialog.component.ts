import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-create-game-dialog",
	templateUrl: "./create-game-dialog.component.html",
	styleUrls: ["./create-game-dialog.component.scss"],
})
export class CreateGameDialogComponent implements OnInit {
	@Output() newGameNameEvent: EventEmitter<string> = new EventEmitter();
	@Output() closeEvent: EventEmitter<any> = new EventEmitter();
	constructor() {}

	ngOnInit() {}

	submit(name: string) {
		this.newGameNameEvent.emit(name);
	}

	close() {
		this.closeEvent.emit();
	}
}

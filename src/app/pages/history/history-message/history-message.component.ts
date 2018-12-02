import { Component, OnInit, Input } from "@angular/core";
import { PlayerColor } from "src/app/types";

@Component({
	selector: "app-history-message",
	templateUrl: "./history-message.component.html",
	styleUrls: ["./history-message.component.scss"],
})
export class HistoryMessageComponent implements OnInit {
	@Input() historyText: string;
	@Input() color: PlayerColor;

	constructor() {}

	ngOnInit() {}
}

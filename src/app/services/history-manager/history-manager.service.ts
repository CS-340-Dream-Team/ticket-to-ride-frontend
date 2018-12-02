import { Injectable } from "@angular/core";
import { Command } from "src/app/types";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class HistoryManagerService {
	private _history: Command[] = [];
	private _historySubject = new Subject<Command[]>();
	private _numNewItemsSubject = new Subject<number>();

	constructor() {}

	get historySubject(): Subject<Command[]> {
		return this._historySubject;
	}

	get numNewItemsSubject(): Subject<number> {
		return this._numNewItemsSubject;
	}

	addItems(commands: Command[]) {
		let num = 0;
		commands.forEach(command => {
			if (command.message && command.message !== "unknown") {
				this._history.push(command);
				num++;
			}
		});
		this._numNewItemsSubject.next(num);
		this._historySubject.next(this._history);
	}
}

import { TestBed } from "@angular/core/testing";

import { ChatManagerService } from "./chat-manager.service";

describe("ChatManagerService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: ChatManagerService = TestBed.get(ChatManagerService);
		expect(service).toBeTruthy();
	});
});

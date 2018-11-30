import { GamePlayManagerService } from "../game-play-manager.service";
import { Segment, BusCard } from "src/app/types";

export default abstract class TurnState {
	public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) {}
	public drawRouteCards(gamePlayManagerService: GamePlayManagerService) {}
	public claimSegment(
		gamePlayManagerService: GamePlayManagerService,
		segment: Segment,
		c: BusCard[]
	) {}
	public openClaimSegmentModal(gamePlayManagerService: GamePlayManagerService, s: Segment): void {}
}

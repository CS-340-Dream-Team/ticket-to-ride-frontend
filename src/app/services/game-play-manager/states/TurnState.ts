import { GamePlayManagerService } from '../game-play-manager.service';

export default abstract class TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) { }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService) { }
}

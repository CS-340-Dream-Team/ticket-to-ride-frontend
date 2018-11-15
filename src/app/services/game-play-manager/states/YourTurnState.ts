import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';

export class YourTurnState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) {
        gamePlayManagerService.selectBusCard(index);
    }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService) { }
}

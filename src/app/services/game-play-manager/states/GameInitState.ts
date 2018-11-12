import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';

export class GameInitState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService) { }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService) { }
}

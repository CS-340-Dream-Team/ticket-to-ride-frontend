import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';

export class NotYourTurnState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService) { }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService) { }
}

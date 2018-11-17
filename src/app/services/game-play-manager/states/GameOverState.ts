import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';

export class GameOverState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) { }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService) { }
}

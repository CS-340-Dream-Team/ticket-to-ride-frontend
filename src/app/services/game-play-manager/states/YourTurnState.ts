import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';

export class YourTurnState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService) { }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService) { }
    public endTurn(gamePlayManagerService: GamePlayManagerService) {
        // Example of setState:
        gamePlayManagerService.setState('notyourturn');
    }
}

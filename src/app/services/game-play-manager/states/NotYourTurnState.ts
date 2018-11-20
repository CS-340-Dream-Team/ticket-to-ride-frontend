import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';
import { Segment } from 'src/app/types';

export class NotYourTurnState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) { }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService, segment: Segment) { }
}

import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';
import { Segment } from 'src/app/types';

export class GameInitState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) { }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) { }
    public claimSegment(gamePlayManagerService: GamePlayManagerService, segment: Segment) { }
    public openClaimSegmentModal(gamePlayManagerService: GamePlayManagerService, s: Segment): void { }
}

import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';
import { Segment, Command } from 'src/app/types';

export class YourTurnState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) {
        gamePlayManagerService.selectBusCard(index);
    }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) {
        gamePlayManagerService.drawRoutes();
    }
    public claimSegment(gamePlayManagerService: GamePlayManagerService, segment: Segment) {
      gamePlayManagerService.serverProxy.claimSegment(segment).then((commands: Command[]) => gamePlayManagerService.handleCommands(commands));
    }
    public openClaimSegmentModal(gamePlayManagerService: GamePlayManagerService, s: Segment): void {
      gamePlayManagerService.segmentBeingClaimed = s;
    }
}

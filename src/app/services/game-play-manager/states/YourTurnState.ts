import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';
import { Segment, Command, BusCard } from 'src/app/types';

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
      const segmentColor = s.color;
      const playerCards = gamePlayManagerService.clientPlayer.busCards;
      if (!Array.isArray(playerCards)) {
        return;
      }
      const playerColorCount = playerCards.reduce((count: number, card: BusCard) => card.color === segmentColor ? ++count : count, 0)
      if (playerColorCount < s.length) {
        // player doesn't have enough
        gamePlayManagerService.toastr.info("You don't have enough cards for that!");
        return;
      }
      gamePlayManagerService.segmentBeingClaimed = s;
    }
}

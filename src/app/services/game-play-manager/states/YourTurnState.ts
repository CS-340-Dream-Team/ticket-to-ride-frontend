import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';
import { Segment, Command, BusCard, Player } from 'src/app/types';

export class YourTurnState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) {
        gamePlayManagerService.selectBusCard(index);
    }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) {
        gamePlayManagerService.drawRoutes();
    }
    public claimSegment(gamePlayManagerService: GamePlayManagerService, segment: Segment, c: BusCard[]) {
      gamePlayManagerService.serverProxy.claimSegment(segment, c).then((commands: Command[]) => gamePlayManagerService.handleCommands(commands)).then(() => {
        // subtract the cards from the current player's inventory
        const player: Player = gamePlayManagerService.clientPlayer;
        for (const card of c) {
          gamePlayManagerService.removeBusCardFromPlayer(player, card);
        }
      });
    }
    public openClaimSegmentModal(gamePlayManagerService: GamePlayManagerService, s: Segment): void {
      const segmentColor = s.color;
      const playerCards = gamePlayManagerService.clientPlayer.busCards;
      if (!Array.isArray(playerCards)) {
        return;
      }
      const playerColorCount = playerCards.filter(card => card.color === segmentColor).length;
      if (playerColorCount < s.length) {
        // player doesn't have enough
        gamePlayManagerService.toastr.info("You don't have enough cards for that!");
        return;
      }
      gamePlayManagerService.segmentBeingClaimed = s;
    }
}

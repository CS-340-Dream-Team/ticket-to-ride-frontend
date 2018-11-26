import TurnState from './TurnState';
import { GamePlayManagerService } from '../game-play-manager.service';
import { Segment, Command, BusCard, Player, BusColor } from 'src/app/types';
import getPlayerCardCounts from 'src/app/utils/player-card-counts';

export class YourTurnState extends TurnState {
    public drawBusCard(gamePlayManagerService: GamePlayManagerService, index: number) {
        gamePlayManagerService.selectBusCard(index);
    }
    public drawRouteCards(gamePlayManagerService: GamePlayManagerService) {
        gamePlayManagerService.drawRoutes();
    }
    public claimSegment(gamePlayManagerService: GamePlayManagerService, segment: Segment, c: BusCard[]) {
      console.log('claiming segment');
      gamePlayManagerService.serverProxy.claimSegment(segment, c).then((commands: Command[]) => gamePlayManagerService.handleCommands(commands)).then(() => {
        console.log('returned from claiming');
        // subtract the cards from the current player's inventory
        const player: Player = gamePlayManagerService.clientPlayer;
        for (const card of c) {
          gamePlayManagerService.removeBusCardFromPlayer(player, card);
        }
      }).catch(res => {
        gamePlayManagerService.toastError(res.command.data.message);
      });
    }
    public openClaimSegmentModal(gamePlayManagerService: GamePlayManagerService, s: Segment): void {
      const segmentColor: BusColor = s.color;
      const playerCards = gamePlayManagerService.clientPlayer.busCards;
      if (!Array.isArray(playerCards)) {
        return;
      }
      if (segmentColor === BusColor.Rainbow) {
        // Gray segment
        const canClaimGray = (segmentLength: number, counts): boolean => {
          return segmentLength <= Math.max(
            counts.red,
            counts.orange,
            counts.yellow,
            counts.green,
            counts.blue,
            counts.purple,
            counts.black,
            counts.white
            ) + counts.rainbow;
        };

        const cardCounts = getPlayerCardCounts(playerCards);
        if (!canClaimGray(s.length, cardCounts)) {
          // player doesn't have enough
          gamePlayManagerService.showInfoToast(`You don't have enough cards for that!`);
          return;
        }
      } else {
        // Colored segment
        const playerColorCount = playerCards.filter(card => card.color === segmentColor || card.color === BusColor.Rainbow).length;
        if (playerColorCount < s.length) {
          // player doesn't have enough
          gamePlayManagerService.showInfoToast(`You don't have enough cards for that!`);
          return;
        }
      }
      gamePlayManagerService.segmentBeingClaimed = s;
    }
}

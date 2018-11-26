import { Component, OnInit } from '@angular/core';
import { Segment, BusColor, Player, BusCard } from 'src/app/types';
import { GamePlayManagerService } from 'src/app/services';
import getPlayerCardCounts from 'src/app/utils/player-card-counts';
import capitalize from 'src/app/utils/capitalize';



@Component({
  selector: 'app-claim-segment',
  templateUrl: './claim-segment.component.html',
  styleUrls: ['./claim-segment.component.scss']
})
export class ClaimSegmentComponent implements OnInit {


  regularColorCount: number = 0;
  wildColorCount: number = 0;
  private _player: Player = null;
  selectedColor: BusColor = BusColor.Red;

  segment: Segment = {
    id: 1,
    start: {
      name: 'Baseball Stadium',
      latLong: {
        lat: 40.254821,
        long: -111.651125
      }
    },
    end: {
      name: 'LaVell Edwards Stadium',
      latLong: {
        lat: 40.257536,
        long: -111.654664
      }
    },
    length: 1,
    pair: 2,
    color: BusColor.Rainbow
  }

  public _busColorToString(b: BusColor): string {
    return BusColor[b]
  }

  public _stringToBusColor(s: string): BusColor {
    return BusColor[s];
  }

  get segmentColor(): string {
    return this._busColorToString(this.segment ? this.segment.color : BusColor.Rainbow);
  }

  get selectedColorStr(): string {
    return this._busColorToString(this.selectedColor);
  }

  set selectedColorStr(value: string) {
    this.selectedColor = this._stringToBusColor(value);
  }

  get playerHasWilds(): boolean {
    return getPlayerCardCounts(<BusCard[]>this._player.busCards)['rainbow'] > 0;
  }

  get colorsPlayerHas(): string[] {
    return Object.keys(getPlayerCardCounts(<BusCard[]>this._player.busCards))
      .map(color => capitalize(color))
      .filter(color => getPlayerCardCounts(<BusCard[]>this._player.busCards)[color] !== 0 &&
        color !== this._busColorToString(BusColor.Rainbow));
  }

  get cardDelta(): number {
    return Math.abs(this.cardsLeftToSet);
  }

  get cardsLeftToSet(): number {
    return this.regularColorCount + this.wildColorCount - (this.segment ? this.segment.length : 0);
  }

  get needFewerCards(): boolean {
    return this.cardsLeftToSet > 0;
  }

  get hasCorrectTotal(): boolean {
    return this.segment && this.regularColorCount + this.wildColorCount === this.segment.length;
  }

  get isValid(): boolean {
    return this.hasCorrectTotal;
  }

  constructor(private gpms: GamePlayManagerService) {
    this.regularColorCount = 0;
    this.wildColorCount = 0;
    this.selectedColor = this.segment && this.segment.color === BusColor.Rainbow ? BusColor.Red : this.segment.color;
    this.gpms.segmentBeingClaimedSubject.subscribe({
      next: (s) => this.segment = s
    })
    this.gpms.clientPlayerSubject.subscribe({
      next: (p) => this._player = p
    });
   }

  ngOnInit() {
  }

  public exit(): void {
    this.regularColorCount = 0;
    this.wildColorCount = 0;
    this.selectedColor = BusColor.Red;
    this.gpms.segmentBeingClaimed = null;
  }

  public confirm(): void {
    const cards: BusCard[] = [];
    // collect the cards
    for (let i = 0; i < this.regularColorCount; ++i) {
      cards.push({ color: this.selectedColor });
    }
    for (let i = 0; i < this.wildColorCount; ++i) {
      cards.push({ color: BusColor.Rainbow });
    }
    this.gpms.claimSegment(this.segment, cards);
  }
}

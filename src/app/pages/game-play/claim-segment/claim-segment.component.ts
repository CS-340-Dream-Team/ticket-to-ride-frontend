import { Component, OnInit } from '@angular/core';
import { Segment, BusColor, Player, BusCard } from 'src/app/types';
import { GamePlayManagerService } from 'src/app/services';



@Component({
  selector: 'app-claim-segment',
  templateUrl: './claim-segment.component.html',
  styleUrls: ['./claim-segment.component.scss']
})
export class ClaimSegmentComponent implements OnInit {


  regularColorCount: number = 0;
  wildColorCount: number = 0;
  private _player: Player = null;
  private _playerCards: { [color: string]: number } = {};
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
    return this._busColorToString(this.segment.color);
  }

  get selectedColorStr(): string {
    console.log(this._busColorToString(this.selectedColor));
    return this._busColorToString(this.selectedColor);
  }

  set selectedColorStr(value: string) {
    this.selectedColor = this._stringToBusColor(value);
    console.log(value, this.selectedColor);
  }

  get playerHasWilds(): boolean {
    const rainbow: string = this._busColorToString(BusColor.Rainbow);
    return this.playerCards[rainbow] > 0;
  }

  get playerCards(): {[color: string]: number} {
    if (Object.keys(this._playerCards).length > 0) {
      return this._playerCards;
    }
    const cards: { [color: string]: number } = {};
    if (!Array.isArray(this._player.busCards)) {
      return cards;
    }

    for (const card of this._player.busCards) {
      const color: string = this._busColorToString(card.color);
      if (!cards[color]) {
        cards[color] = 0;
      }
      cards[color] += 1;
    }
    this._playerCards = cards;
    return cards;
  }

  get colorsPlayerHas(): string[] {
    return Object.keys(this.playerCards).filter(color => color !== this._busColorToString(BusColor.Rainbow));
  }

  get cardDelta(): number {
    return Math.abs(this.cardsLeftToSet);
  }

  get cardsLeftToSet(): number {
    return this.regularColorCount + this.wildColorCount - this.segment.length;
  }

  get needFewerCards(): boolean {
    return this.cardsLeftToSet > 0;
  }

  get hasCorrectTotal(): boolean {
    return this.regularColorCount + this.wildColorCount === this.segment.length;
  }

  get isValid(): boolean {
    return this.hasCorrectTotal;
  }

  constructor(private gpms: GamePlayManagerService) {
    this.regularColorCount = this.segment.length;
    this.wildColorCount = 0;
    this.selectedColor = this.segment.color === BusColor.Rainbow ? BusColor.Red : this.segment.color;
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
    this.gpms.segmentBeingClaimed = null;
  }

  public confirm(): void {
    const cards: BusCard[] = [];
    for (const [color, quantity] of Object.entries(this.playerCards)) {
      const card: BusCard = { color: BusColor[color] };
      for (let i = 0; i < quantity; ++i) {
        cards.push(card);
      }
    }
    // collect the cards
    this.gpms.claimSegment(this.segment, cards);
  }
}

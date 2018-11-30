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
export class ClaimSegmentComponent {

  regularColorCount: number = 0;
  wildColorCount: number = 0;
  private _player: Player = null;
  selectedColor: BusColor = BusColor.Red;

  segment: Segment = null;

  public display(s: Segment, p: Player) {
    this._player = p;
    this.segment = s;
    this.regularColorCount = 0;
    this.wildColorCount = 0;
    if (s) {
      this.selectedColor = this.segment && this.segment.color === BusColor.Rainbow ? BusColor.Red : this.segment.color;
    }
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
      .filter(color => getPlayerCardCounts(<BusCard[]>this._player.busCards)[color] !== 0 &&
        color !== this._busColorToString(BusColor.Rainbow).toLowerCase())
      .map(color => capitalize(color));
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
  get numberOfColorInHand():number{
    return getPlayerCardCounts(<BusCard[]>this._player.busCards)[this._busColorToString(this.selectedColor).toLowerCase()]
  }
  get numberOfWildInHand():number{
    return getPlayerCardCounts(<BusCard[]>this._player.busCards)['rainbow']
  }
  get colorLimit(): number{
    return Math.min(this.segment.length-this.wildColorCount, this.numberOfColorInHand)
  }
  get wildLimit(): number{
    return Math.min(this.segment.length - this.regularColorCount, this.numberOfWildInHand)
  }
  get hasCorrectTotal(): boolean {
    return this.segment && this.regularColorCount + this.wildColorCount === this.segment.length;
  }

  get isValid(): boolean {
    return this.hasCorrectTotal;
  }

  constructor(private gpms: GamePlayManagerService) {

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

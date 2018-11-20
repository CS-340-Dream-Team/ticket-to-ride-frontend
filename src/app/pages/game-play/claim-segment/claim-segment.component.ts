import { Component, OnInit } from '@angular/core';
import { Segment, BusColor } from 'src/app/types';
import { GamePlayManagerService } from 'src/app/services';



@Component({
  selector: 'app-claim-segment',
  templateUrl: './claim-segment.component.html',
  styleUrls: ['./claim-segment.component.scss']
})
export class ClaimSegmentComponent implements OnInit {


  regularColorCount: number = 0;
  wildColorCount: number = 0;
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

  get segmentColor(): string {
    return BusColor[this.segment.color];
  }

  get selectedColorStr(): string {
    return BusColor[this.selectedColor];
  }

  set selectedColorStr(value: string) {
    console.log(value);
    this.selectedColor = BusColor[value];
  }

  get playerHasWilds(): boolean {
    return true;
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

  get isValid(): boolean {
    return this.regularColorCount + this.wildColorCount === this.segment.length;
  }

  constructor(private gpms: GamePlayManagerService) {
    this.regularColorCount = this.segment.length;
    this.wildColorCount = 0;
    this.selectedColor = this.segment.color === BusColor.Rainbow ? BusColor.Red : this.segment.color;
    this.gpms.segmentBeingClaimedSubject.subscribe({
      next: (s) => this.segment = s
    })
   }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

  constructor(private driverService: DriverService) { }

  ngOnInit() {
  }

  drive() {
    this.driverService.drive();
  }

}

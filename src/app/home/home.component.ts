import { Component, OnInit } from '@angular/core';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private systemService: SystemService) { }


  ngOnInit() {
    this.fetchSystemFiles();
  }

  fetchSystemFiles() {
    this.systemService.fetchSystemFiles();
  }

}

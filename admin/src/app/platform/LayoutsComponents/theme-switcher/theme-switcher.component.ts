import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {

  mode = "";
  constructor() { }

  ngOnInit(): void {
    this.getTheme();
  }

  getTheme() {
    let theme = localStorage.getItem(environment.appPrefix+"theme");
    if (theme && theme === "dark") {
      this.mode="dark";
    } else {
      this.mode="light";
    }    
  }

  switchTheme() {
    let theme = localStorage.getItem(environment.appPrefix+"theme");
    if (theme && theme === "dark") {
      document.body.classList.remove('dark-theme');
      localStorage.setItem(environment.appPrefix+"theme","light");
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem(environment.appPrefix+"theme","dark");
    }
    this.getTheme();
  }

}

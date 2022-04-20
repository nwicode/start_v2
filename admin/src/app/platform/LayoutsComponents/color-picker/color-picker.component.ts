import { Component, OnInit } from '@angular/core';
import { Output, Input, EventEmitter } from '@angular/core';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Input() color:string = '#ffffff';
  @Input() presetColors :string = '';
  @Input() disableAlpha:boolean = true;
  @Output() onClose = new EventEmitter();
  @Output() onChange = new EventEmitter();
  @Output() onChanged = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  handleChangeComplete($event: ColorEvent) {
    this.onChanged.emit($event.color);
  }

  handleChange($event: ColorEvent) {
    this.onChange.emit($event.color);
    //console.log($event.color);
    // color = {
    //   hex: '#333',
    //   rgb: {
    //     r: 51,
    //     g: 51,
    //     b: 51,
    //     a: 1,
    //   },
    //   hsl: {
    //     h: 0,
    //     s: 0,
    //     l: .20,
    //     a: 1,
    //   },
    // }
  }


  overlayClick(event:MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.onClose.emit({});
  }

}

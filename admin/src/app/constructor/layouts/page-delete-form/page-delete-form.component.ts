import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayoutService} from '../../../services/layout.service';


@Component({
  selector: 'app-page-delete-form',
  templateUrl: './page-delete-form.component.html',
  styleUrls: ['./page-delete-form.component.scss']
})
export class PageDeleteFormComponent implements OnInit {

  @Input('page_id') public page_id:number;
  @Input('page_name') public page_name:string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();

  constructor(private layoutService:LayoutService) { }

  ngOnInit(): void {
  }


  
  /**
   * Run close panel event with confirm
   */
  public confirmDeleteForm() {
    this.delete.emit({page_id: this.page_id});
  }
  

  /**
   * Run close panel event
   */
  public closeForm() {
    this.close.emit({});
  }

}

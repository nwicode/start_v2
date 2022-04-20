import { Component, Input, OnInit } from '@angular/core';
import { LayoutService} from '../../../services/layout.service';

@Component({
  selector: 'app-page-create-form',
  templateUrl: './page-create-form.component.html',
  styleUrls: ['./page-create-form.component.scss']
})
export class PageCreateFormComponent implements OnInit {

  public form_name:string = "";

  @Input('form_type') public form_type: string;
  constructor(private layoutService:LayoutService) { }

  ngOnInit(): void {
  }

  addPage() {

    this.layoutService.createActionEvent("pageFormSubmit",{form_name:this.form_name, form_type:this.form_type});
  }

  cancel() {
    this.layoutService.createActionEvent("pageFormClose",{});
  }

}

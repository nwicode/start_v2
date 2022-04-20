import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubheaderService } from '../ConstructorComponents/subheader/_services/subheader.service';
import {Observable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ApplicationService} from '../../services/application.service'
import { ActivatedRoute, Router } from '@angular/router';
import {TranslationService} from "../../services/translation.service";
import {ToastService} from '../../platform/framework/core/services/toast.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {GalleryDialog} from '../ConstructorComponents/gallery-dialog/gallery-dialog.objects';
import {GalleryDialogComponent} from '../ConstructorComponents/gallery-dialog/gallery-dialog.component';
import {GalleryImagesService} from '../ConstructorComponents/gallery-dialog/services/gallery-images.service';
import { environment } from 'src/environments/environment';

interface Car {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-application-menu',
  templateUrl: './application-menu.component.html',
  styleUrls: ['./application-menu.component.scss']
})
export class ApplicationMenuComponent implements OnInit {

  isLoading$: Observable<boolean>;
  app_id: number;
  was_changed:boolean = false;
  was_loaded:boolean = false;
  menu:any[] = [];
  languages:any[] = [];
  actions:any[] = [];
  default_language:string = "";
  resources_dir:string = "";
  platform_url:string = "";

  object_in_editor: any;

  constructor(private route: ActivatedRoute, private modalService: NgbModal, public dialog: MatDialog, private galleryImagesService: GalleryImagesService, private ref: ChangeDetectorRef , private translationService: TranslationService, private router: Router, private toastService: ToastService, private activateRoute: ActivatedRoute, private subheader: SubheaderService, private applicationService:ApplicationService) { }


  ngOnInit(): void {

    this.platform_url = environment.apiUrl;

    const gallery = localStorage.getItem('open_gallery');
    if (gallery != null) {
        localStorage.removeItem('open_gallery');
        this.openGalleryDialog();
    }
    this.galleryImagesService.dataFound.subscribe(
        data => {
            console.log('dataFound', data);
        }
    );


    this.app_id = Number(this.router.url.match(/constructor\/(\d+)/)[1]);
    setTimeout(() => {
      this.subheader.setTitle('CONSTRUCTOR.APP_MENU.TITLE');
    }, 1);       
    
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationMenu(this.app_id).then(data=>{
        this.menu = [];
        this.languages = data.languages;
        this.menu = data.menu;
        this.resources_dir = data.resources_dir;
        this.actions = data.actions;
        this.default_language = data.default_language;
        this.was_loaded = true;
        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    });    

    console.log('queryParams', this.route.snapshot.queryParams);
    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['test'] != null) {
        this.galleryImagesService.onDataFound('OK CHECK NOW');
    }

  }

  addItem() {
    let item = {
      name: "Menu",
      name_translations:[],
      action_text: "",
      action_target: "",
      action_name: "",
      image: "",
      target: "Page1",
      show_confirm: false,
      show_editor: false
    }

    let name_translations = [];
    this.languages.forEach( lng_item => {
      if (lng_item.code == this.default_language) item.name = "Name";

      name_translations.push({
        language_code: lng_item.code,
        language_name: lng_item.name,
        language_value: "Name",
      })
    });

    item.name_translations = name_translations;

    this.menu.unshift(item);
    this.was_changed = true;
  }

  //if actionb was changed - change object
  actionChange(ev:any) {
    console.log(ev);
    this.actions.forEach(action => {
      if (action.target==ev) {
        this.object_in_editor.action_text = action.text;
        this.object_in_editor.action_target = action.target;
        this.object_in_editor.action_name = action.name;
      }
    });
  }

  //drop event
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menu, event.previousIndex, event.currentIndex);
    this.was_changed = true;
  }

  save() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.setApplicationMenu(this.app_id,this.menu).then(response=>{
        if (response.is_error) {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_NOT_SAVED'), 'danger');
        } else {
          this.toastService.showsToastBar(this.translationService.translatePhrase('GENERAL.LANGUAGES.CHANGES_SAVED'), 'success');
        }        
        observer.next(false);
        this.was_changed = false;
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 
  }

  cancel() {
    this.isLoading$ = new Observable<boolean>(observer => {
      observer.next(true);
      this.applicationService.getApplicationMenu(this.app_id).then(data=>{
        this.menu = [];
        this.languages = data.languages;
        this.menu = data.menu;
        this.resources_dir = data.resources_dir;
        this.actions = data.actions;
        this.default_language = data.default_language;
        this.was_loaded = true;
        observer.next(false);
      }).finally( ()=>{
        //observer.next(false);
      });
    }); 
  }


  /**
   * Open menu dialog
   * @param item menu item
   */
  openEditor(item:any) {
    console.log(item);
    this.menu.forEach(element => {
      element.show_editor = false;
    });
    item.show_editor = true;
    item.show_confirm = false;
    this.object_in_editor = Object.assign({}, item);
  }

  /**
   * Apply menu changes in menu array
   * @param item item,
   * @param item_index item index in menu array 
   */
  applyChanges(item:any, item_index: number) {
    this.object_in_editor.name_translations.forEach(element => {
      if (element.language_code==this.default_language) this.object_in_editor.name = element.language_value;
    });
    this.object_in_editor.show_editor = false;
    this.object_in_editor.show_confirm = false;
    this.menu[item_index] = Object.assign({}, this.object_in_editor);
    this.ref.detectChanges();
    this.was_changed = true;
    console.log(this.menu[item_index]);
  }

  /**
   * Remove item menu
   * @param item item
   * @param item_index item index
   */
  removeItem(item:any, item_index: number){
    this.menu.splice(item_index,1);
    this.was_changed = true;
    this.ref.detectChanges();
  }


  openGalleryDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = new GalleryDialog(this.resources_dir, false, '.jpg,.png,.jpeg,.ico,.svg', this.resources_dir);
    const dialogRef = this.dialog.open(GalleryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            // This will Return Selected Images
            this.object_in_editor.image = result.fileName;
            console.log('SELECTED IMAGES', result);
            this.ref.detectChanges();
        }
    });
  }

  clearImage() {
    this.object_in_editor.image = "";
  }
}

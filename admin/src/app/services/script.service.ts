import { Renderer2, Inject, Injectable } from '@angular/core';

import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

 /**
  * Append the JS tag to the Document Body.
  * @param renderer The Angular Renderer
  * @param src The path to the script
  * @returns the script element
  */

  public reloadJsScript(renderer: Renderer2, src: string, id:string): any {

    //document.getElementById(id).remove();
    let myScript = renderer.createElement('script');
    myScript.type = `text/javascript`;
    myScript.id = id;
    myScript.text = src;
    renderer.appendChild(document.body, myScript);    
    return myScript;
  }

}

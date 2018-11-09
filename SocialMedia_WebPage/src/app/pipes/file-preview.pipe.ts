import { Pipe, PipeTransform } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'filePreview'
})
export class FilePreviewPipe implements PipeTransform {

  constructor( private domSanitizer:DomSanitizer){
  }

  transform(file: File): any {
    if(/^image\//.test(file.type))
      return this.domSanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
    else
      return "";
  }

}

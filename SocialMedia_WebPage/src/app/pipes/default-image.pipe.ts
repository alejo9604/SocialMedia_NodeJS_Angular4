import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {

  transform(value: any, profile:boolean = false): string {

    let noimage:string = "assets/img/noimage.png";
    let profileImage:string = "assets/img/profile.png";

    if(!value){
      if(profile){
        return profileImage;
      }
      return noimage;
    }

    return value.path;
  }

}


import { Photo } from './photo';

export class Album{

  public id:number;
  public name:string;
  public description:string;
  public creation_date:Date;
  public update_date:Date;

  public previewPhotos:Photo[];

  constructor(id:number, name:string, description:string, creation_date:Date, update_date:Date){
    this.id= id;
    this.name = name;
    this.description = description;
    this.creation_date = creation_date;
    this.update_date = update_date;
    this.previewPhotos = [];
  }

  public setPreviewPhotosFormJson( json ){
    this.previewPhotos = [];

    for(let j of json){
      this.previewPhotos.push( new Photo( j.id, j.title, j.description, j.photo_path, j.order, j.creation_date, j.update_date) );
    }
  }

}

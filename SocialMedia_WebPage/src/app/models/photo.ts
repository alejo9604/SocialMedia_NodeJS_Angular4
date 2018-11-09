
export class Photo{

  public id:number;
  public title:string;
  public path:string;
  public description:string;
  public creation_date:Date;
  public update_date:Date;
  public order:number;
  public owner:string;

  constructor(id:number, title:string, description:string, path:string, order:number, creation_date:Date = new Date(), update_date:Date = new Date()){
    this.id = id;
    this.title = title;
    this.description = (description) ? description : "";
    this.path = path;
    this.creation_date = creation_date;
    this.update_date = update_date;
    this.order = order;
  }

  public exchangePhoto(p:Photo){
    let index = p.order;
    p.order = this.order;
    this.order = index;
  }

}

import { Directive, EventEmitter, ElementRef,
         HostListener, Input, Output } from '@angular/core';
import { FileItem } from "../models/file-item";

@Directive({
  selector: '[NgInputFile]',
  host: {"(input)": 'onInputChange($event)'}
})
export class NgInputFileDirective {

  @Input() files:FileItem[] = [];
  @Input() file:FileItem;
  @Input() isMultiple:boolean = true;
  @Output() fileIn: EventEmitter<any> = new EventEmitter();

  constructor( public elemento:ElementRef ) { }

  onInputChange(event){

    if (event.target.files && event.target.files.length > 0) {
        if(this.isMultiple){
          this._agregarArchivos(event.target.files);
        }else{
          let arch = event.target.files[0];
          if( this._archivoPuedeSerCargado( arch ) ){
            this.files.splice(0,1);
            this.files.push( new FileItem( arch ) );
            console.log(this.files);
          }
        }
    }

  }

  private _agregarArchivos( archivosLista:FileList ){

    for( let prop in Object.getOwnPropertyNames( archivosLista ) ){

      let arch = archivosLista[prop];

      if( this._archivoPuedeSerCargado( arch ) ){

        let nuevoArch = new FileItem( arch );
        this.files.push( nuevoArch );

      }

    }

    //console.log(this.files);
  }

  private _prevenirYDetener( event:any ){
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoPuedeSerCargado( archivo ){

    if( !this._archivoYaFueDroppeado( archivo.name ) && this._esImagen(archivo.type) ){
      return true;
    }
    return false;

  }


  private _archivoYaFueDroppeado( nombreArchivo:string ):boolean {

    for( let i in this.files ){
      let arch = this.files[i].file;

      if(arch.name === nombreArchivo ){
        return true;
      }
    }

    return false;
  }

  private _esImagen( tipoArchivo:string ):boolean{
    return ( tipoArchivo == '' || tipoArchivo == undefined ) ? false : tipoArchivo.startsWith("image");
  }

}

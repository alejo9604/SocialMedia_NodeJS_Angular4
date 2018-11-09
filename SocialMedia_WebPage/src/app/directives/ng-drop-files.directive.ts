import { Directive, EventEmitter, ElementRef,
         HostListener, Input, Output } from '@angular/core';
import { FileItem } from "../models/file-item";
@Directive({
  selector: '[NgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() files:FileItem[] = [];
  @Output() fileIn: EventEmitter<any> = new EventEmitter();

  constructor( public elemento:ElementRef ) {}



  @HostListener('dragenter', ['$event'])
  public onDragEnter( event:any ){
    this.fileIn.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event:any ){
    this.fileIn.emit(false);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver( event:any ){

    let transferencia = this._getTransferencia( event );
    transferencia.dropEffect = 'copy';

    this._prevenirYDetener( event );

    this.fileIn.emit(true);
  }

  @HostListener('drop', ['$event'])
  public onDrop( event:any ){

    let transferencia = this._getTransferencia( event );

    if(!transferencia){
      return;
    }

    this._agregarArchivos( transferencia.files );
    this.fileIn.emit(false);

    this._prevenirYDetener( event );
  }


  private _getTransferencia( event:any ){
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
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

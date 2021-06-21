import { Component, ViewChild, ElementRef, Input,Output,EventEmitter } from "@angular/core";
import { FormGroup, FormControl, FormGroupDirective, FormArray } from '@angular/forms';
import { File } from '../dossier/file'
import { Folder } from '../dossier/dossier'
import { UploadService } from '../services/UploadService/upload.service'
import { DossierService } from '../services/DossierService/dossier.service'
import  $ from 'jquery'
@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"],
})
export class UploadComponent {
  @Input() dossier=new Folder
  @Input() folderFiles=[]
  @Input() nb_files=[]
  @Output() done = new EventEmitter<Boolean>(false);
  @Output() uploadedFile = new EventEmitter<any>();
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];

  /**
   * on file drop handler
   */
  constructor(private ups:UploadService,private ds:DossierService){

  }
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);
    this.upload=false
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    $(".files-list").css("display", "block");
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000)
    this.uploadFile()
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    this.files=[]
    for (const item of files) {
      item.progress = 0;
      this.files=this.files.concat(item);
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  upload=false
  fileForm=new FormGroup({
    avatar: new FormControl
  }
  )
  uploadFile(){
    this.upload=true
    const formData =new FormData()
    console.log("file",this.files[0])
    if(this.files[0].size<=52428800){
      formData.append('avatar',this.files[0])
      formData.append('name',this.files[0].name)
      formData.append('_id',this.dossier._id)
      formData.append('taille',this.files[0].size)
      formData.append('type',this.files[0].type)
      if(this.files[0].progress==100){
        $(".files-list").css("display", "none");
        this.done.emit(true);
      }
      this.ups.addFile('http://localhost:3002/uploads',formData).subscribe((resp)=>{
        this.uploadedFile.emit(this.files[0])
      })
    }
    else{
      this.done.emit(false)
      $(".files-list").css("display", "none");
    }

  }
  uploadImage(){
    this.upload=true
    const formData =new FormData()
    let file=[]
    file.unshift(this.files[0])
    file.unshift(this.files[1])
    formData.append('imgs[]',file.toString())
    this.ups.addFile('http://localhost:3002/uploads',formData).subscribe((resp)=>{
      console.log(resp)
    })
  }
}
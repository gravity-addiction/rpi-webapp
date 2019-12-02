import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'byteconvert'
})
export class ByteconvertPipe implements PipeTransform {
  constructor(
    private sanitized: DomSanitizer
  ) { }

  transform(bytes: any, decimals: number): any {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return this.sanitized.bypassSecurityTrustHtml(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' <small>' + sizes[i] + '</small>');
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ByteconvertPipe
  ],
  exports: [
    ByteconvertPipe
  ]
})
export class ByteconvertModule {}

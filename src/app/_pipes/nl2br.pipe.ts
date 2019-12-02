import { NgModule, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'nl2br'
})
export class Nl2BrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, ...args: any[]): any {
    if (typeof value !== 'string') {
      return value;
    }
    let result: any;
    const textParsed = value.replace(/(?:\r\n|\r|\n)/g, '<br />');

    if (args[0]) {
      result = this.sanitizer.sanitize(SecurityContext.HTML, textParsed);
    } else {
      result = textParsed;
    }

    return result;
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Nl2BrPipe
  ],
  exports: [
    Nl2BrPipe
  ]
})
export class Nl2BrModule {}
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
  name: 'keyvalue'
})
export class KeyvaluePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let keys = [];
    for (let key in value) {
      let val = value[key];
      if (typeof val === 'object') { val = 'object'; }
      keys.push({key: key, value: val});
    }
    return keys;
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    KeyvaluePipe
  ],
  exports: [
    KeyvaluePipe
  ]
})
export class KeyvalueModule {}
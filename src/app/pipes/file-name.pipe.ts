import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    let length = 25;
    if(value.slice(0,20).toUpperCase() === value.slice(0,20)) {
      console.log(value)
      length = 19;
    }
    if(value.length > length)
      {value = value.slice(0, length+1);
      return value + "...";}
    return value;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if(value.length > 25)
      {value = value.slice(0, 26);
      return value + "...";}
    return value;
  }

}

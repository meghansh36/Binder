import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    let filename =  value.slice(value.lastIndexOf('\\')+1);
    if(filename.length > 25)
      {filename = filename.slice(0, 26);
      return filename + "...";}
    return filename;
  }

}

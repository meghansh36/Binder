import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: any, start: number, end: number): any {
    let matchingString = value.substr(start, end);
    return value.replace(matchingString, "<mark>" + matchingString + "</mark>");
  }

}

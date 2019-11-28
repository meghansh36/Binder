import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  static readonly maxCharLimit = 57;

  transform(value: string, start: number, end: number): any {
    let patternLength = end - start;
    let matchingString = value.substring(start, end)
    let valueArray = Array.from(value)
    console.log(value)
    if(valueArray.length > HighlightPipe.maxCharLimit) {
      let gutterLength = Number((HighlightPipe.maxCharLimit - patternLength)/2);
      if(start > HighlightPipe.maxCharLimit || (start <= HighlightPipe.maxCharLimit && end > HighlightPipe.maxCharLimit)) {
        
        console.log(gutterLength, start-gutterLength)
        if(start - gutterLength > 0)
        valueArray.splice(0, start - gutterLength, ".", ".", ".")
        
      }
      
      if(valueArray.length > HighlightPipe.maxCharLimit) {
        valueArray.splice(HighlightPipe.maxCharLimit - 3, 10000,".", ".", ".")
      }
      value = valueArray.join('')

    }
    return value.replace(matchingString, "<mark>" + matchingString + "</mark>");
  }

}

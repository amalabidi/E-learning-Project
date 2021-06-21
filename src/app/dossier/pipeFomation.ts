import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterFormation'
})
export class FormationPipe implements PipeTransform {

  transform(arr: any[], prop: string, value: string ): any {
    if (arr) {
      if (!value) {
        return arr
      } else {
        return arr.filter(obj => this.filter(obj[prop],value))
      }
    } else {
      return []
    }
  }

  filter(source :string, target :string) : boolean {

    return source.includes(target)
  }
}
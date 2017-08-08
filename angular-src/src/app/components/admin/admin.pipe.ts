import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNo'
})

export class YesNoPipe implements PipeTransform{
  transform(admin: boolean): string{
    if(admin == true){
      return "Sí";
    } else {
      return "No";
    }
  }
}

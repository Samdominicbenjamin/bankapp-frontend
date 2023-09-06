import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(allTransactions:any[],searchTerm:string,propsName:string): any[]{
    const result:any[] = [];

    if(!allTransactions||searchTerm==''||propsName==''){
      return allTransactions;
    }
    allTransactions.forEach((item:any)=>{
      if(item[propsName].trim().toLowerCase().includes(searchTerm.trim().toLowerCase())){
        result.push(item)
      }
    })
    return result;
  }

}

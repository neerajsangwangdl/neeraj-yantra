import {Pipe, PipeTransform} from "@angular/core";
@Pipe({name: 'groupByDate'})
export class GroupByPipe implements PipeTransform {
transform(collection: Array<any>, property: string = 'created_on'): Array<any> {
    if(!collection) {
        return null;
    }
    const collectionByDate = collection.reduce((previous, current)=> {
		var d = new Date(current[property]);
		let date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        if(!previous[date]) {
            previous[date] = [];
        }
		previous[date].push(current)
        return previous;
    }, {});
	return Object.keys(collectionByDate).map(date => {
        let dt = date.split("/");
        let newDate = new Date( parseInt(dt[2]), parseInt(dt[1]) - 1, parseInt(dt[0]));
        return { 'date': newDate, 'arr': collectionByDate[date], }
    })
    }  
}
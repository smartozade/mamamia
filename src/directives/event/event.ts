import { Directive } from '@angular/core';

/**
 * Generated class for the EventDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[event]', // Attribute selector
  host:{
    '(ionScroll)':'scroll($event)'
  }
})
export class EventDirective {

  constructor() {
    console.log('Hello EventDirective Directive');
  }

  scroll(evt){
    console.log(evt);
  }

}

import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';
// fade in animation
export const fadeInAnimation: AnimationTriggerMetadata = trigger('fadeInAnimation', [
  state('true', style({opacity: 1})),
  state('false', style({opacity: 0})),
  transition('1 => 0', animate('3000ms')),
  transition('0 => 1', animate('2000ms'))
]);

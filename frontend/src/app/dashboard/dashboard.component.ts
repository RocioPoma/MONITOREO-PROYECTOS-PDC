import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

  animations: [
    trigger('rotateIcon', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed <=> expanded', animate('200ms ease-out'))
    ]),
    trigger('collapseSubmenu', [
      state('collapsed', style({ maxHeight: '0' })),
      state('expanded', style({ maxHeight: '1000px' })),
      transition('collapsed <=> expanded', animate('200ms ease-out'))
    ])
  ]


})
export class DashboardComponent {

    isSubmenuOpen: boolean = false;

      toggleSubmenu(): void {
        this.isSubmenuOpen = !this.isSubmenuOpen;
      }
}
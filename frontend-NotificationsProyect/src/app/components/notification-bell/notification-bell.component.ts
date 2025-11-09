import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
  notifications: AppNotification[] = [];
  unread = 0;
  dropdownOpen = false;
  userId = Number(localStorage.getItem('userId'));

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
   const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.notificationService.loadNotifications(); // ya no necesita userId
      this.notificationService.initRealtime(userId);
    }

    this.notificationService.getNotificationsObservable()
        .subscribe(list => this.notifications = list);

    this.notificationService.getUnreadCountObservable()
        .subscribe(c => this.unread = c);
  }

  // 🛎️ Abre o cierra el dropdown
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // 🖱️ Cierra el dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideBell = target.closest('.notification-bell-container');
    if (!clickedInsideBell) {
      this.dropdownOpen = false;
    }
  }

  // ✅ Marca todas las notificaciones como leídas
  markAllRead(): void {
    this.notificationService.markAllAsRead(this.userId);
  }

  // 👁️ Marca una notificación individual como leída
  markRead(n: AppNotification): void {
    if (!n.read) {
      this.notificationService.markAsRead(n.id);
    }
  }
}

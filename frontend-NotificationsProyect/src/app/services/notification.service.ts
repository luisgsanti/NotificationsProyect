import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EchoService } from './echo.service';
import { environment } from '../../environments/environment';

export interface AppNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  
  private notifications$ = new BehaviorSubject<AppNotification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private echoService: EchoService) {}

  async loadNotifications(page = 1) {
  const url = `${environment.apiBaseUrl}/api/notifications?page=${page}`;
  try {
    const resp: any = await firstValueFrom(this.http.get(url));
    const items: AppNotification[] = resp.data ?? resp.notifications ?? resp;
    this.notifications$.next(items);
    this.updateUnreadCount();
    return items;
  } catch (err) {
    console.error('Error loading notifications', err);
    return [];
  }
}


  markAsRead(id: number) {
    const url = `${environment.apiBaseUrl}/api/notifications/${id}/read`;
    return this.http.patch(url, {}).toPromise().then(() => {
      const list = this.notifications$.value.map(n => (n.id === id ? { ...n, read: true } : n));
      this.notifications$.next(list);
      this.updateUnreadCount();
    }).catch(e => console.error('Error marking read', e));
  }


  markAllAsRead(userId: number) {
    const url = `${environment.apiBaseUrl}/api/notifications/mark-all-read`;
    return this.http.post(url, { user_id: userId }).toPromise().then(() => {
      const list = this.notifications$.value.map(n => ({ ...n, read: true }));
      this.notifications$.next(list);
      this.updateUnreadCount();
    }).catch(e => {
        const list = this.notifications$.value.map(n => ({ ...n, read: true }));
        this.notifications$.next(list);
        this.updateUnreadCount();
        console.warn('Mark all as read failed on server; updated locally', e);
    });
  }


  initRealtime(userId: number) {
  const echo = this.echoService.init();

  // Desconectar canales previos (si existen)
  echo.leaveAllChannels();

  const channelName = `notifications.user.${userId}`;
  echo.channel(channelName)
    .listen('.NotificationCreated', (payload: any) => this.handleIncoming(payload))
    .listen('NotificationCreated', (payload: any) => this.handleIncoming(payload));
}

  private handleIncoming(payload: any) {
    const notification: AppNotification = payload as AppNotification;
    const current = this.notifications$.value;
    this.notifications$.next([notification, ...current]);
    this.updateUnreadCount();
    console.log('Realtime notification received', notification);
  }

  getNotificationsObservable() { return this.notifications$.asObservable(); }
  getUnreadCountObservable() { return this.unreadCount$.asObservable(); }

  private updateUnreadCount() {
    const count = this.notifications$.value.filter(n => !n.read).length;
    this.unreadCount$.next(count);
  }

  reset() {
    this.notifications$.next([]);
    this.unreadCount$.next(0);
    this.echoService.disconnect();
  }
}
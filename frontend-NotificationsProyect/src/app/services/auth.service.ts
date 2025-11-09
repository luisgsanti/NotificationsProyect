import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/login`;
  private userUrl = `${environment.apiBaseUrl}/api/user`; // endpoint que devuelve datos del usuario autenticado

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  /**
   * Inicia sesión y guarda el token y los datos del usuario en el localStorage.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      // 1️⃣ Guardamos el token cuando llega la respuesta del login
      tap(response => {
        localStorage.setItem('token', response.token);
      }),
      // 2️⃣ Luego, hacemos una nueva petición a /api/user para obtener id y nombre
      switchMap(() => this.http.get<any>(this.userUrl, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })),
      // 3️⃣ Guardamos los datos del usuario autenticado
      tap(user => {
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
      })
    );
  }

  /**
   * Elimina los datos del almacenamiento local al cerrar sesión.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    this.notificationService.reset(); // limpia el estado de notificaciones
  }

  /**
   * Devuelve el token guardado.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Devuelve el ID del usuario autenticado.
   */
  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  /**
   * Devuelve el nombre del usuario autenticado.
   */
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
}

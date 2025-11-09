import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EchoService {
  // Puede empezar como null, pero garantizamos que al devolverla no será null
  private echoInstance: Echo<any> | null = null;

  constructor() {
    (window as any).Pusher = Pusher;
  }

  /**
   * Inicializa Laravel Echo si aún no existe y devuelve siempre una instancia válida.
   */
  init(): Echo<any> {
    if (!this.echoInstance) {
      this.echoInstance = new (Echo as any)({
        broadcaster: 'pusher',
        key: environment.reverbKey || 'local',
        wsHost: environment.reverbHost || '127.0.0.1',
        wsPort: Number(environment.reverbPort || 6001),
        wssPort: Number(environment.reverbPort || 6001),
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        cluster: '',
      } as any);

      console.log('✅ Echo inicializado correctamente');
    }

    // El operador ! le indica a TypeScript que aquí jamás será null
    return this.echoInstance!;
  }

  /**
   * Obtiene la instancia actual (puede ser null si no se ha iniciado).
   */
  getInstance(): Echo<any> | null {
    return this.echoInstance;
  }

  /**
   * Cierra todos los canales y desconecta Echo.
   */
  disconnect(): void {
    if (this.echoInstance) {
      try {
        this.echoInstance.leaveAllChannels();
        this.echoInstance.disconnect();
        console.log('🔴 Echo desconectado correctamente');
      } catch (err) {
        console.warn('⚠️ Error al desconectar Echo:', err);
      } finally {
        this.echoInstance = null;
      }
    }
  }
}

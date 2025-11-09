import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 👈 IMPORTANTE
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

interface Particle {
  top: number;
  left: number;
  size: number;
  delay: number;
  color: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // 👈 AGREGA ESTO
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  particles: Particle[] = [];

  ngOnInit() {
    this.generateParticles(20); // 💫 puedes cambiar el número aquí
  }

  generateParticles(count: number) {
    const colors = [
      'bg-white/40',
      'bg-emerald-300/40',
      'bg-emerald-200/50',
      'bg-white/30',
      'bg-emerald-400/60',
    ];

    this.particles = Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  onLogin() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.loading = true;
      this.errorMsg = '';

      this.authService.login(this.email, this.password).subscribe({
        next: (res) => {
          const userId = Number(localStorage.getItem('userId'));
          this.notificationService.reset();
          this.notificationService.loadNotifications();
          this.notificationService.initRealtime(userId);
          this.router.navigate(['/app/notifications']);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Error al iniciar sesión';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }, 1500);
  }
}
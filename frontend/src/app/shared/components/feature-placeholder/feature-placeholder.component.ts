
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './feature-placeholder.component.html',
  styleUrl: './feature-placeholder.component.css',
})
export class FeaturePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  @Input()
  title: string =
    this.route.snapshot.data['title'] ?? 'Our Services';

  @Input()
  description: string =
    this.route.snapshot.data['description'] ??
    'Discover the services that make every journey more comfortable.';

  @Input()
  showServices = false;
}

import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-task-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './task-comments.component.html',
  styleUrl: './task-comments.component.scss'
})
export class TaskCommentsComponent implements OnInit {
  @Input({ required: true }) taskId!: number;
  
  comments = signal<Comment[]>([]);
  isLoading = signal(false);
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading.set(true);
    this.commentService.getCommentsByTask(this.taskId).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.commentForm.disable();
      
      const commentData = {
        body: this.commentForm.value.content,
        taskId: this.taskId
      };

      console.log('Sending comment data:', commentData);
      console.log('Task ID:', this.taskId);

      this.commentService.createComment(commentData).subscribe({
        next: (newComment) => {
          console.log('Comment created successfully:', newComment);
          this.comments.update(comments => [...comments, newComment]);
          this.commentForm.reset();
          this.commentForm.enable();
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error creating comment:', error);
          console.error('Error details:', error.error);
          this.commentForm.enable();
          this.isLoading.set(false);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isMyComment(comment: Comment): boolean {
    return comment.user_id === this.currentUser()?.id;
  }
}

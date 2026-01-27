import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Comment, CreateCommentDto } from '../models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.apiUrl;
  comments = signal<Comment[]>([]);

  constructor(private http: HttpClient) {}

  getCommentsByTask(taskId: number): Observable<Comment[]> {
    const params = new HttpParams().set('taskId', taskId.toString());
    
    return this.http.get<Comment[]>(`${this.apiUrl}/api/comments`, { params }).pipe(
      tap(comments => {
        console.log('Comments loaded:', comments);
        this.comments.set(comments);
      })
    );
  }

  createComment(commentData: CreateCommentDto): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/api/comments`, commentData).pipe(
      tap(newComment => {
        console.log('Comment created:', newComment);
        this.comments.update(comments => [...comments, newComment]);
      })
    );
  }
}

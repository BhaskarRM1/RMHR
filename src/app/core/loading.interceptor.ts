import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private loading: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Skip global loader when caller opts out via header
        const track = !req.headers.has('X-Skip-Loading');
        if (track) this.loading.show();
        return next.handle(req).pipe(finalize(() => { if (track) this.loading.hide(); }));
    }
}

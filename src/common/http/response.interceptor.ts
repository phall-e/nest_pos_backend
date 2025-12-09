import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ResponseDto } from "../dtos/response.dto";

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T> { 
   intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
        const timestamp = new Date().getTime();
        return next.handle().pipe(
            map((payload) => ({
                payload,
                timestamp,
            })),
        );
   }
}
import { ArgumentsHost } from '@nestjs/common';
import { EyewitnessService } from './service';

export class Eyewitness {
  private static doNotReportExceptions: any[] = [];

  static doNotReport(exceptions: Array<any>) {
    const exceptionNames: any[] = [];
    exceptions.forEach(e => {
      exceptionNames.push(e.name);
    });
    Eyewitness.doNotReportExceptions = exceptionNames;
  }

  static watch(exception: any, host: ArgumentsHost) {
    if (Eyewitness.doNotReportExceptions.includes(exception.constructor.name)) {
      return;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<any>();

    EyewitnessService.alert({
      exception: {
        name: exception.constructor.name,
        message: exception.message,
        stack: exception.stack.toString(),
      },
      request: {
        timestamp: new Date().toString(),
        headers: JSON.stringify(request.headers),
        payload: JSON.stringify({
          ...request.query,
          ...request.body,
          ...request.params,
        }),
        url:
          request.protocol + '://' + request.get('host') + request.originalUrl,
      },
    });

    return {};
  }
}

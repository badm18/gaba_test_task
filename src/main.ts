import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './filters/exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost.httpAdapter))

  const port = process.env.APP_PORT || 3000
  await app.listen(port)

  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap()

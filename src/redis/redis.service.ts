import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';


@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: configService.get("REDIS_CACHE_HOST"),
      port: configService.get("REDIS_CACHE_PORT"),
      password: configService.get("REDIS_CACHE_PASSWORD"),
    });
  }

  private logger = new Logger('RedisService');

  async set(key: string, value: string, ttl: number) {
    await this.client.set(key, value, 'EX', ttl);
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  /**
   * JSON 데이터 저장 (RedisJSON 사용)
   * @param key Redis key
   * @param path JSON path (기본적으로 루트 "$")
   * @param value 저장할 JSON 데이터
   */
  async setJsonData(key: string, value: any, path: string = '$'): Promise<void> {
    await this.client.call('JSON.SET', key, path, JSON.stringify(value));
  }

  /**
   * JSON 데이터 조회 (RedisJSON 사용)
   * @param key Redis key
   * @param path JSON path (기본적으로 루트 "$")
   */
  async getJsonData<T>(key: string, path: string = '$'): Promise<T> {
    this.logger.log(`key : ${key}`);

    const data = await this.client.call('JSON.GET', key, path) as string;

    this.logger.log(`return json : ${data}`);

    return data ? JSON.parse(data) : null;
  }
}

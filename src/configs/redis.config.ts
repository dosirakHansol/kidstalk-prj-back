import { ConfigService } from "@nestjs/config";

export const redisConfig = async (configService: ConfigService): Promise<any> => {
    return {
        host: configService.get("REDIS_CACHE_HOST"),
	    port: configService.get("REDIS_CACHE_PORT"),
	    password: configService.get("REDIS_CACHE_PASSWORD"),
    }
}
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { ConfigService } from "@nestjs/config";

export const typeORMConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true,  // 개발 환경에서는 true로 설정, 프로덕션에서는 false로 설정하는 것이 좋음
        namingStrategy: new SnakeNamingStrategy(),
        logging: true,
    };
};
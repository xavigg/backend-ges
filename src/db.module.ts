import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('PG_HOST'),
                port: configService.get<number>('PG_PORT'),
                username: configService.get('PG_USER'),
                password: configService.get('PG_PW'),
                database: configService.get('PG_DB'),
                entities: [join(__dirname, '**', '*.entity.{ts,js}')],
                synchronize: true,
                keepConnectionAlive: true,
            })
        })
    ]
})

export class DbModule {}
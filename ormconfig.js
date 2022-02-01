require('dotenv').config();

let config = {};

const enviroment = process.env.NODE_ENV?.toLocaleLowerCase()

if(enviroment === 'test'){
    config = {
        type: 'sqlite',
        database: './testdb.sql',
        entities: [
            'src/core/infra/data/database/entities/**/*'
        ],
        migrations : [
            'src/core/infra/data/database/migrations/**/*'
        ],
    }
} else {
    config = {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        logging: false,
        entities: [
            'src/core/infra/data/database/entities/**/*'
        ],
        migrations : [
            'src/core/infra/data/database/migrations/**/*'
        ],
        cli: {
            entitiesDir: 'src/core/infra/data/database/entities',
            migrationsDir: 'src/core/infra/data/database/migrations'
        },
        // extra: {
        //     ssl: {
        //         rejectUnauthorized: false
        //     }
        // }
    }
}

module.exports = config;
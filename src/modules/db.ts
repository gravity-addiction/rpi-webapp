import * as Knex from 'knex';

export class DB {
  private static knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './rpi-webapp.db'
    },
    useNullAsDefault: true
  };

  public static knex: Knex = DB.startup();

  private static startup(): Knex {
    const dbConfig = DB.knexConfig;
    const k = Knex(dbConfig);

    return k;
  }

}



import {schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

// Initial schema is handled by WatermelonDB at version 1.
// Add future migrations here as the app schema evolves.
const migrations = schemaMigrations({
  migrations: [],
});

export default migrations;

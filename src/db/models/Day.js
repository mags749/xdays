import {Model} from '@nozbe/watermelondb';
import {field, date, readonly, nochange} from '@nozbe/watermelondb/decorators';

export default class Day extends Model {
  static table = 'days';

  @field('title') title;
  @field('timestamp') timestamp;
  @field('counter') counter;
  @field('notify') notify;
}

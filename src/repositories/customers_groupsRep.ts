import BaseRepository from './baseRep.ts';
import { customer_groups } from '../utils/auvoInterfaces.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class Customers_groupsRep extends BaseRepository<customer_groups> {
  get tableName() {
    return 'auvo_customers_groups';
  }
  get primaryKey(): (keyof customer_groups)[] {
    return ['fk_customerId', 'fk_groupId'];
  }
  get columns(): (keyof customer_groups)[] {
    return ['fk_customerId', 'fk_groupId'];
  }
  super() {
    bindPublicMethods(this);
  }
}

export default new Customers_groupsRep();

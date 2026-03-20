import BaseRepository from './baseRep.ts';
import { customer_managers } from '../utils/auvoInterfaces.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class Customers_groupsRep extends BaseRepository<customer_managers> {
  get tableName() {
    return 'auvo_customers_groups';
  }
  get primaryKey(): (keyof customer_managers)[] {
    return ['fk_userId', 'fk_customerId'];
  }
  get columns(): (keyof customer_managers)[] {
    return ['fk_userId', 'fk_customerId'];
  }
  super() {
    bindPublicMethods(this);
  }
}

export default new Customers_groupsRep();

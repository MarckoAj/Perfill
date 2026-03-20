import BaseRepository from './baseRep.ts';
import { customer_emails } from '../utils/auvoInterfaces.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class Customers_emailsRep extends BaseRepository<customer_emails> {
  get tableName() {
    return 'auvo_customers_emails';
  }
  get primaryKey(): (keyof customer_emails)[] {
    return ['fk_customerId', 'customer_email'];
  }
  get columns(): (keyof customer_emails)[] {
    return ['fk_customerId', 'customer_email'];
  }
  super() {
    bindPublicMethods(this);
  }
}

export default new Customers_emailsRep();

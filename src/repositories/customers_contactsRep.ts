import BaseRepository from './baseRep.ts';
import { customer_contacts } from '../utils/auvoInterfaces.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class Customers_contactsRep extends BaseRepository<customer_contacts> {
  get tableName() {
    return 'auvo_customers_contacts';
  }
  get primaryKey(): keyof customer_contacts {
    return 'contactId';
  }
  get columns(): (keyof customer_contacts)[] {
    return [
      'contactId',
      'fk_customerId',
      'description',
      'contactJobPosition',
      'contactEmail',
      'contactPhone',
      'contactName',
    ];
  }
  super() {
    bindPublicMethods(this);
  }
}
export default new Customers_contactsRep();

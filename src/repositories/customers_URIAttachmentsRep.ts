import BaseRepository from './baseRep.ts';
import { customer_URIattachments } from '../utils/auvoInterfaces.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class Customer_URIattachments extends BaseRepository<customer_URIattachments> {
  get tableName() {
    return 'auvo_customers_uri_attachments';
  }
  get primaryKey(): keyof customer_URIattachments {
    return 'fk_customerId';
  }
  get columns(): (keyof customer_URIattachments)[] {
    return ['fk_customerId', 'uri'];
  }
  super() {
    bindPublicMethods(this);
  }
}
export default new Customer_URIattachments();

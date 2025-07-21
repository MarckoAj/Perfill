import { CustomerRefactored } from '../utils/auvoInterfaces.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';
import BaseRepository from './baseRep.ts';

class CustomersRep extends BaseRepository<CustomerRefactored> {
  get tableName(): string {
    return 'auvo_customers';
  }
  get primaryKey(): keyof CustomerRefactored {
    return 'customerId';
  }
  get columns(): (keyof CustomerRefactored)[] {
    return [
      'customerId',
      'externalId',
      'description',
      'cpfCnpj',
      'manager',
      'note',
      'addressComplement',
      'latitude',
      'longitude',
      'uriAttachments',
      'active',
      'dateLastUpdate',
      'creationDate',
    ];
  }
  super() {
    bindPublicMethods(this);
  }
}

export default new CustomersRep();

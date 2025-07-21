import BaseModel from './baseMod.ts';
import customersRep from '../repositories/customersRep.ts';
import { AuvoCustomer, CustomerRefactored } from '../utils/auvoInterfaces.ts';

class CustomersMod extends BaseModel<AuvoCustomer, CustomerRefactored> {
  protected repository = customersRep;
  protected mainKey: keyof CustomerRefactored = 'customerId';
  protected mapToDatabaseFormat(auvoCustomer: AuvoCustomer): CustomerRefactored {
    const filteredCustomer: CustomerRefactored = {
      customerId: auvoCustomer.id,
      fk_segmentId: auvoCustomer.segmentId,
      externalId: auvoCustomer.externalId,
      description: auvoCustomer.description,
      cpfCnpj: auvoCustomer.cpfCnpj,
      manager: auvoCustomer.manager,
      note: auvoCustomer.address,
      address: auvoCustomer.address,
      addressComplement: auvoCustomer.adressComplement,
      latitude: auvoCustomer.latitude,
      longitude: auvoCustomer.longitude,
      uriAttachments: auvoCustomer.uriAttachments,
      active: auvoCustomer.active,
      dateLastUpdate: auvoCustomer.dateLastUpdate ?? '',
      creationDate: auvoCustomer.creationDate ?? '',
    };

    return filteredCustomer;
  }
}

export default new CustomersMod();

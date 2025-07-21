import { AuvoSegment, AuvoCustomerSegment } from '../utils/auvoInterfaces.ts';
import segmentRep from '../repositories/segmentRep.ts';
import BaseModel from './baseMod.ts';

class SegmentsModel extends BaseModel<AuvoSegment, AuvoCustomerSegment> {
  protected repository = segmentRep;

  protected mainKey: keyof AuvoCustomerSegment = 'segmentId';

  protected mapToDatabaseFormat(entity: AuvoSegment): AuvoCustomerSegment {
    return {
      segmentId: entity.id,
      description: entity.description,
      registrationDate: entity.registrationDate,
    };
  }
}

export default new SegmentsModel();

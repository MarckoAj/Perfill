import { Segment, CustomerSegment } from '../utils/auvoInterfaces.ts';
import segmentRep from '../repositores/segmentRep.ts';
import BaseModel from './baseMod.ts';

class SegmentsModel extends BaseModel<Segment, CustomerSegment> {
  protected repository = segmentRep;

  protected mainKey: keyof CustomerSegment = 'segmentId';

  protected mapToDatabaseFormat(entity: Segment): CustomerSegment {
    return {
      segmentId: entity.id,
      description: entity.description,
      registrationDate: entity.registrationDate,
    };
  }
}

export default new SegmentsModel();

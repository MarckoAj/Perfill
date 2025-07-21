import { AuvoCustomerSegment } from '../utils/auvoInterfaces.ts';
import BaseRepository from './baseRep.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class SegmentRepository extends BaseRepository<AuvoCustomerSegment> {
  protected tableName = 'auvo_segments';

  protected get primaryKey(): keyof AuvoCustomerSegment {
    return 'segmentId';
  }

  protected get columns(): (keyof AuvoCustomerSegment)[] {
    return ['segmentId', 'description', 'registrationDate'];
  }

  constructor() {
    super();
    bindPublicMethods(this);
  }
}

export default new SegmentRepository();

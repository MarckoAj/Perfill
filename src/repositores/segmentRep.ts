import { CustomerSegment } from '../utils/auvoInterfaces.ts';
import BaseRepository from './baseRep.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class SegmentRepository extends BaseRepository<CustomerSegment> {
  protected tableName = 'auvo_segments';

  protected get primaryKey(): keyof CustomerSegment {
    return 'segmentId';
  }

  protected get columns(): (keyof CustomerSegment)[] {
    return ['segmentId', 'description', 'registrationDate'];
  }

  constructor() {
    super();
    bindPublicMethods(this);
  }
}

export default new SegmentRepository();

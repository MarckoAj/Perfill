import { CustomerSegment } from '../utils/auvoInterfaces.ts';
import BaseRepository from './baseRep.ts';

class SegmentRepository extends BaseRepository<CustomerSegment> {
  protected tableName = 'auvo_segments';

  protected get primaryKey(): keyof CustomerSegment {
    return 'segmentId';
  }

  protected get columns(): (keyof CustomerSegment)[] {
    return ['segmentId', 'description', 'registrationDate'];
  }
}

export default new SegmentRepository();

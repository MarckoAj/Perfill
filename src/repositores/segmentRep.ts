import executeQuery from '../infrastructure/database/queries.ts';
import { CustomerSegment } from '../utils/auvoInterfaces.ts';

class segmentsRopository {
  async selectSegmentById(segmentId: number) {
    const sql = 'SELECT * FROM auvo_segments WHERE segmentId =?';
    return executeQuery(sql, segmentId);
  }

  async insertSegment(segment: CustomerSegment) {
    const sql =
      'INSERT INTO auvo_segments (segmentId, description, registrationDate) VALUES (?, ?, ?)';
    const values = Object.values(segment);
    return executeQuery(sql, values);
  }

  async updateSegment(segment: CustomerSegment) {
    const sql =
      'UPDATE auvo_segments SET description = ? , registrationDate =? WHERE segmentId = ?';
    const values = Object.values(segment);
    values.push(values.shift());
    return executeQuery(sql, values);
  }
}

export default new segmentsRopository();

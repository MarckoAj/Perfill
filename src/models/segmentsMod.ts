import { Segment, CustomerSegment } from '../utils/auvoInterfaces.ts';
import { QueryResult } from '../infrastructure/database/queries.ts';
import { RowDataPacket } from 'mysql2';
import segmentRep from '../repositores/segmentRep.ts';

class SegmentsModel {
  async synchronizeSegment(segment: Segment): Promise<QueryResult | null> {
    const segmentRefatored: CustomerSegment = {
      segmentId: segment.id,
      description: segment.description,
      registrationDate: segment.registrationDate,
    };
    try {
      const segmentInDatabase = (await segmentRep.selectSegmentById(segment.id)) as RowDataPacket;
      return segmentInDatabase.length
        ? await segmentRep.updateSegment(segmentRefatored)
        : await segmentRep.insertSegment(segmentRefatored);
    } catch (error) {
      console.error(
        `Erro ao sincronizar Segmento: ${error instanceof Error ? error.message : error}`,
      );
      return null;
    }
  }

  async addSegmentList(list: Segment[]): Promise<(QueryResult | null)[]> {
    try {
      return await Promise.all(list.map((segment: Segment) => this.synchronizeSegment(segment)));
    } catch (error) {
      console.error(
        `Erro ao adicionar lista de segmentos: ${error instanceof Error ? error.message : error}`,
      );
      return list.map(() => null);
    }
  }
}
export default new SegmentsModel();

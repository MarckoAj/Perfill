import executeQuery, { QueryResult } from '../queries.ts';

class SegmentSeeders {
  async addAllSeeders(): Promise<void> {
    try {
      await this.seedDataSegments();
    } catch (error) {
      console.log(error);
    }
  }

  async seedDataSegments(): Promise<QueryResult> {
    const sql = `
    INSERT INTO auvo_segments (segmentId, description)
   SELECT *
   FROM (SELECT 0 AS segmentId, "NOT_ASSIGNED" AS description )
    AS  TEMP
   WHERE NOT EXISTS (
       SELECT segmentId FROM auvo_segments WHERE segmentId = 0
   )
   UNION ALL
   SELECT *
   FROM (SELECT 22923 AS segmentId, "SELECT" AS description) AS TEMP
   WHERE NOT EXISTS (
       SELECT segmentId FROM auvo_segments WHERE segmentId = 22923
   );
    `;
    return executeQuery(sql);
  }
}

export default new SegmentSeeders();

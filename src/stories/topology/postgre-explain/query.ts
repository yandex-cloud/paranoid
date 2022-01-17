const query = `
explain ({{value}})  WITH src AS (SELECT name, created, null_version, delete_marker, data_size, data_md5, mds_couple_id, mds_key_version, mds_key_uuid, parts_count, creator_id, storage_class, acl, metadata, parts
    FROM v1_code.object_info(i_bucket_name=>'pg-12', i_bid=>'8440b7ea-2747-464f-aa55-e2f24a3ea6a9', i_name=>'0kb.data')
    ),
    range AS (SELECT CASE WHEN 0<0 THEN 0+data_size ELSE 0 END AS start, CASE WHEN 0=0 THEN data_size ELSE 0 END AS end
    FROM src
    ),
    parts_0 AS (SELECT (parts_raw.pt).part_id AS part_id, (parts_raw.pt).data_size AS data_size, (parts_raw.pt).mds_couple_id AS mds_couple_id, (parts_raw.pt).mds_key_version AS mds_key_version, (parts_raw.pt).mds_key_uuid AS mds_key_uuid
    FROM (SELECT unnest(parts) AS pt
    FROM src
    ) AS parts_raw
    CROSS JOIN src
    ),
    parts_1 AS (SELECT part_id, data_size, mds_couple_id, mds_key_version, mds_key_uuid, SUM(data_size) OVER (ORDER BY part_id) - data_size AS range_start, SUM(data_size) OVER (ORDER BY part_id) AS range_end
    FROM parts_0
    ),
    parts AS (SELECT p1.part_id AS part_id, p1.data_size AS data_size, p1.mds_couple_id AS mds_couple_id, p1.mds_key_version AS mds_key_version, p1.mds_key_uuid AS mds_key_uuid, p1.range_start AS range_start, p1.range_end AS range_end
    FROM parts_1 AS p1
    INNER JOIN range ON p1.range_start < range.end AND
     p1.range_end > range.start
    )
    SELECT p.part_id AS part_part_id, p.data_size AS part_data_size, p.mds_couple_id AS part_mds_couple_id, p.mds_key_version AS part_mds_key_version, p.mds_key_uuid AS part_mds_key_uuid, p.range_start AS part_range_start, p.range_end AS part_range_end, o.name AS name, o.created AS created, o.null_version AS null_version, o.delete_marker AS delete_marker, o.data_size AS data_size, o.data_md5 AS data_md5, o.mds_couple_id AS mds_couple_id, o.mds_key_version AS mds_key_version, o.mds_key_uuid AS mds_key_uuid, o.parts_count AS parts_count, o.creator_id AS creator_id, o.storage_class AS storage_class, o.acl AS acl, o.metadata AS metadata
    FROM parts AS p
    FULL JOIN src AS o ON 0=1
    ORDER BY part_id
    ;
`;
export enum QueryType {
  Format = "FORMAT json",
  Analyze = "FORMAT json, ANALYZE",
  Full = "FORMAT json, ANALYZE, BUFFERS, TIMING, VERBOSE",
}

export function getQuery(type: QueryType) {
  return query.replace("{{value}}", type);
}

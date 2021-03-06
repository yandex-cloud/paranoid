export const explain = `
[
    {
      "Plan": {
        "Node Type": "Sort",
        "Parallel Aware": false,
        "Startup Cost": 14407882919.46,
        "Total Cost": 14410660696.96,
        "Plan Rows": 1111111000,
        "Plan Width": 298,
        "Actual Startup Time": 6.276,
        "Actual Total Time": 6.278,
        "Actual Rows": 1,
        "Actual Loops": 1,
        "Output": ["p1.part_id", "p1.data_size", "p1.mds_couple_id", "p1.mds_key_version", "p1.mds_key_uuid", "p1.range_start", "p1.range_end", "o.name", "o.created", "o.null_version", "o.delete_marker", "o.data_size", "o.data_md5", "o.mds_couple_id", "o.mds_key_version", "o.mds_key_uuid", "o.parts_count", "o.creator_id", "o.storage_class", "o.acl", "o.metadata", "p1.part_id"],
        "Sort Key": ["p1.part_id"],
        "Sort Method": "quicksort",
        "Sort Space Used": 25,
        "Sort Space Type": "Memory",
        "Shared Hit Blocks": 2024,
        "Shared Read Blocks": 0,
        "Shared Dirtied Blocks": 0,
        "Shared Written Blocks": 0,
        "Local Hit Blocks": 0,
        "Local Read Blocks": 0,
        "Local Dirtied Blocks": 0,
        "Local Written Blocks": 0,
        "Temp Read Blocks": 0,
        "Temp Written Blocks": 0,
        "I/O Read Time": 0.000,
        "I/O Write Time": 0.000,
        "Plans": [
          {
            "Node Type": "Function Scan",
            "Parent Relationship": "InitPlan",
            "Subplan Name": "CTE src",
            "Parallel Aware": false,
            "Function Name": "object_info",
            "Schema": "v1_code",
            "Alias": "object_info",
            "Startup Cost": 0.25,
            "Total Cost": 10.25,
            "Plan Rows": 1000,
            "Plan Width": 226,
            "Actual Startup Time": 6.222,
            "Actual Total Time": 6.222,
            "Actual Rows": 1,
            "Actual Loops": 1,
            "Output": ["object_info.name", "object_info.created", "object_info.null_version", "object_info.delete_marker", "object_info.data_size", "object_info.data_md5", "object_info.mds_couple_id", "object_info.mds_key_version", "object_info.mds_key_uuid", "object_info.parts_count", "object_info.creator_id", "object_info.storage_class", "object_info.acl", "object_info.metadata", "object_info.parts"],
            "Function Call": "v1_code.object_info('pg-12'::text, '8440b7ea-2747-464f-aa55-e2f24a3ea6a9'::uuid, '0kb.data'::text, NULL::timestamp with time zone, false)",
            "Shared Hit Blocks": 2021,
            "Shared Read Blocks": 0,
            "Shared Dirtied Blocks": 0,
            "Shared Written Blocks": 0,
            "Local Hit Blocks": 0,
            "Local Read Blocks": 0,
            "Local Dirtied Blocks": 0,
            "Local Written Blocks": 0,
            "Temp Read Blocks": 0,
            "Temp Written Blocks": 0,
            "I/O Read Time": 0.000,
            "I/O Write Time": 0.000
          },
          {
            "Node Type": "Merge Join",
            "Parent Relationship": "Outer",
            "Parallel Aware": false,
            "Join Type": "Full",
            "Startup Cost": 1444147.33,
            "Total Cost": 13974015002.33,
            "Plan Rows": 1111111000,
            "Plan Width": 298,
            "Actual Startup Time": 6.251,
            "Actual Total Time": 6.253,
            "Actual Rows": 1,
            "Actual Loops": 1,
            "Output": ["p1.part_id", "p1.data_size", "p1.mds_couple_id", "p1.mds_key_version", "p1.mds_key_uuid", "p1.range_start", "p1.range_end", "o.name", "o.created", "o.null_version", "o.delete_marker", "o.data_size", "o.data_md5", "o.mds_couple_id", "o.mds_key_version", "o.mds_key_uuid", "o.parts_count", "o.creator_id", "o.storage_class", "o.acl", "o.metadata", "p1.part_id"],
            "Inner Unique": false,
            "Join Filter": "false",
            "Rows Removed by Join Filter": 0,
            "Shared Hit Blocks": 2021,
            "Shared Read Blocks": 0,
            "Shared Dirtied Blocks": 0,
            "Shared Written Blocks": 0,
            "Local Hit Blocks": 0,
            "Local Read Blocks": 0,
            "Local Dirtied Blocks": 0,
            "Local Written Blocks": 0,
            "Temp Read Blocks": 0,
            "Temp Written Blocks": 0,
            "I/O Read Time": 0.000,
            "I/O Write Time": 0.000,
            "Plans": [
              {
                "Node Type": "Nested Loop",
                "Parent Relationship": "Outer",
                "Parallel Aware": false,
                "Join Type": "Inner",
                "Startup Cost": 1444147.33,
                "Total Cost": 85127482.33,
                "Plan Rows": 1111111000,
                "Plan Width": 100,
                "Actual Startup Time": 6.247,
                "Actual Total Time": 6.248,
                "Actual Rows": 0,
                "Actual Loops": 1,
                "Output": ["p1.part_id", "p1.data_size", "p1.mds_couple_id", "p1.mds_key_version", "p1.mds_key_uuid", "p1.range_start", "p1.range_end"],
                "Inner Unique": false,
                "Join Filter": "(p1.range_start < (src.data_size)::numeric)",
                "Rows Removed by Join Filter": 0,
                "Shared Hit Blocks": 2021,
                "Shared Read Blocks": 0,
                "Shared Dirtied Blocks": 0,
                "Shared Written Blocks": 0,
                "Local Hit Blocks": 0,
                "Local Read Blocks": 0,
                "Local Dirtied Blocks": 0,
                "Local Written Blocks": 0,
                "Temp Read Blocks": 0,
                "Temp Written Blocks": 0,
                "I/O Read Time": 0.000,
                "I/O Write Time": 0.000,
                "Plans": [
                  {
                    "Node Type": "Subquery Scan",
                    "Parent Relationship": "Outer",
                    "Parallel Aware": false,
                    "Alias": "p1",
                    "Startup Cost": 1444147.33,
                    "Total Cost": 1794147.33,
                    "Plan Rows": 3333333,
                    "Plan Width": 100,
                    "Actual Startup Time": 6.247,
                    "Actual Total Time": 6.248,
                    "Actual Rows": 0,
                    "Actual Loops": 1,
                    "Output": ["p1.part_id", "p1.data_size", "p1.mds_couple_id", "p1.mds_key_version", "p1.mds_key_uuid", "p1.range_start", "p1.range_end"],
                    "Filter": "(p1.range_end > '0'::numeric)",
                    "Rows Removed by Filter": 0,
                    "Shared Hit Blocks": 2021,
                    "Shared Read Blocks": 0,
                    "Shared Dirtied Blocks": 0,
                    "Shared Written Blocks": 0,
                    "Local Hit Blocks": 0,
                    "Local Read Blocks": 0,
                    "Local Dirtied Blocks": 0,
                    "Local Written Blocks": 0,
                    "Temp Read Blocks": 0,
                    "Temp Written Blocks": 0,
                    "I/O Read Time": 0.000,
                    "I/O Write Time": 0.000,
                    "Plans": [
                      {
                        "Node Type": "WindowAgg",
                        "Parent Relationship": "Subquery",
                        "Parallel Aware": false,
                        "Startup Cost": 1444147.33,
                        "Total Cost": 1669147.33,
                        "Plan Rows": 10000000,
                        "Plan Width": 100,
                        "Actual Startup Time": 6.246,
                        "Actual Total Time": 6.247,
                        "Actual Rows": 0,
                        "Actual Loops": 1,
                        "Output": ["(((unnest(src_2.parts))).part_id)", "((unnest(src_2.parts))).data_size", "((unnest(src_2.parts))).mds_couple_id", "((unnest(src_2.parts))).mds_key_version", "((unnest(src_2.parts))).mds_key_uuid", "(sum(((unnest(src_2.parts))).data_size) OVER (?) - (((unnest(src_2.parts))).data_size)::numeric)", "sum(((unnest(src_2.parts))).data_size) OVER (?)"],
                        "Shared Hit Blocks": 2021,
                        "Shared Read Blocks": 0,
                        "Shared Dirtied Blocks": 0,
                        "Shared Written Blocks": 0,
                        "Local Hit Blocks": 0,
                        "Local Read Blocks": 0,
                        "Local Dirtied Blocks": 0,
                        "Local Written Blocks": 0,
                        "Temp Read Blocks": 0,
                        "Temp Written Blocks": 0,
                        "I/O Read Time": 0.000,
                        "I/O Write Time": 0.000,
                        "Plans": [
                          {
                            "Node Type": "Sort",
                            "Parent Relationship": "Outer",
                            "Parallel Aware": false,
                            "Startup Cost": 1444147.33,
                            "Total Cost": 1469147.33,
                            "Plan Rows": 10000000,
                            "Plan Width": 36,
                            "Actual Startup Time": 6.235,
                            "Actual Total Time": 6.236,
                            "Actual Rows": 0,
                            "Actual Loops": 1,
                            "Output": ["(((unnest(src_2.parts))).part_id)", "(unnest(src_2.parts))"],
                            "Sort Key": ["(((unnest(src_2.parts))).part_id)"],
                            "Sort Method": "quicksort",
                            "Sort Space Used": 25,
                            "Sort Space Type": "Memory",
                            "Shared Hit Blocks": 2021,
                            "Shared Read Blocks": 0,
                            "Shared Dirtied Blocks": 0,
                            "Shared Written Blocks": 0,
                            "Local Hit Blocks": 0,
                            "Local Read Blocks": 0,
                            "Local Dirtied Blocks": 0,
                            "Local Written Blocks": 0,
                            "Temp Read Blocks": 0,
                            "Temp Written Blocks": 0,
                            "I/O Read Time": 0.000,
                            "I/O Write Time": 0.000,
                            "Plans": [
                              {
                                "Node Type": "Nested Loop",
                                "Parent Relationship": "Outer",
                                "Parallel Aware": false,
                                "Join Type": "Inner",
                                "Startup Cost": 0.00,
                                "Total Cost": 125222.50,
                                "Plan Rows": 10000000,
                                "Plan Width": 36,
                                "Actual Startup Time": 6.229,
                                "Actual Total Time": 6.230,
                                "Actual Rows": 0,
                                "Actual Loops": 1,
                                "Output": ["((unnest(src_2.parts))).part_id", "(unnest(src_2.parts))"],
                                "Inner Unique": false,
                                "Shared Hit Blocks": 2021,
                                "Shared Read Blocks": 0,
                                "Shared Dirtied Blocks": 0,
                                "Shared Written Blocks": 0,
                                "Local Hit Blocks": 0,
                                "Local Read Blocks": 0,
                                "Local Dirtied Blocks": 0,
                                "Local Written Blocks": 0,
                                "Temp Read Blocks": 0,
                                "Temp Written Blocks": 0,
                                "I/O Read Time": 0.000,
                                "I/O Write Time": 0.000,
                                "Plans": [
                                  {
                                    "Node Type": "CTE Scan",
                                    "Parent Relationship": "Outer",
                                    "Parallel Aware": false,
                                    "CTE Name": "src",
                                    "Alias": "src_1",
                                    "Startup Cost": 0.00,
                                    "Total Cost": 20.00,
                                    "Plan Rows": 1000,
                                    "Plan Width": 0,
                                    "Actual Startup Time": 6.224,
                                    "Actual Total Time": 6.225,
                                    "Actual Rows": 1,
                                    "Actual Loops": 1,
                                    "Output": ["src_1.name", "src_1.created", "src_1.null_version", "src_1.delete_marker", "src_1.data_size", "src_1.data_md5", "src_1.mds_couple_id", "src_1.mds_key_version", "src_1.mds_key_uuid", "src_1.parts_count", "src_1.creator_id", "src_1.storage_class", "src_1.acl", "src_1.metadata", "src_1.parts"],
                                    "Shared Hit Blocks": 2021,
                                    "Shared Read Blocks": 0,
                                    "Shared Dirtied Blocks": 0,
                                    "Shared Written Blocks": 0,
                                    "Local Hit Blocks": 0,
                                    "Local Read Blocks": 0,
                                    "Local Dirtied Blocks": 0,
                                    "Local Written Blocks": 0,
                                    "Temp Read Blocks": 0,
                                    "Temp Written Blocks": 0,
                                    "I/O Read Time": 0.000,
                                    "I/O Write Time": 0.000
                                  },
                                  {
                                    "Node Type": "Materialize",
                                    "Parent Relationship": "Inner",
                                    "Parallel Aware": false,
                                    "Startup Cost": 0.00,
                                    "Total Cost": 227.50,
                                    "Plan Rows": 10000,
                                    "Plan Width": 32,
                                    "Actual Startup Time": 0.003,
                                    "Actual Total Time": 0.004,
                                    "Actual Rows": 0,
                                    "Actual Loops": 1,
                                    "Output": ["(unnest(src_2.parts))"],
                                    "Shared Hit Blocks": 0,
                                    "Shared Read Blocks": 0,
                                    "Shared Dirtied Blocks": 0,
                                    "Shared Written Blocks": 0,
                                    "Local Hit Blocks": 0,
                                    "Local Read Blocks": 0,
                                    "Local Dirtied Blocks": 0,
                                    "Local Written Blocks": 0,
                                    "Temp Read Blocks": 0,
                                    "Temp Written Blocks": 0,
                                    "I/O Read Time": 0.000,
                                    "I/O Write Time": 0.000,
                                    "Plans": [
                                      {
                                        "Node Type": "ProjectSet",
                                        "Parent Relationship": "Outer",
                                        "Parallel Aware": false,
                                        "Startup Cost": 0.00,
                                        "Total Cost": 77.50,
                                        "Plan Rows": 10000,
                                        "Plan Width": 32,
                                        "Actual Startup Time": 0.002,
                                        "Actual Total Time": 0.002,
                                        "Actual Rows": 0,
                                        "Actual Loops": 1,
                                        "Output": ["unnest(src_2.parts)"],
                                        "Shared Hit Blocks": 0,
                                        "Shared Read Blocks": 0,
                                        "Shared Dirtied Blocks": 0,
                                        "Shared Written Blocks": 0,
                                        "Local Hit Blocks": 0,
                                        "Local Read Blocks": 0,
                                        "Local Dirtied Blocks": 0,
                                        "Local Written Blocks": 0,
                                        "Temp Read Blocks": 0,
                                        "Temp Written Blocks": 0,
                                        "I/O Read Time": 0.000,
                                        "I/O Write Time": 0.000,
                                        "Plans": [
                                          {
                                            "Node Type": "CTE Scan",
                                            "Parent Relationship": "Outer",
                                            "Parallel Aware": false,
                                            "CTE Name": "src",
                                            "Alias": "src_2",
                                            "Startup Cost": 0.00,
                                            "Total Cost": 20.00,
                                            "Plan Rows": 1000,
                                            "Plan Width": 32,
                                            "Actual Startup Time": 0.000,
                                            "Actual Total Time": 0.001,
                                            "Actual Rows": 1,
                                            "Actual Loops": 1,
                                            "Output": ["src_2.name", "src_2.created", "src_2.null_version", "src_2.delete_marker", "src_2.data_size", "src_2.data_md5", "src_2.mds_couple_id", "src_2.mds_key_version", "src_2.mds_key_uuid", "src_2.parts_count", "src_2.creator_id", "src_2.storage_class", "src_2.acl", "src_2.metadata", "src_2.parts"],
                                            "Shared Hit Blocks": 0,
                                            "Shared Read Blocks": 0,
                                            "Shared Dirtied Blocks": 0,
                                            "Shared Written Blocks": 0,
                                            "Local Hit Blocks": 0,
                                            "Local Read Blocks": 0,
                                            "Local Dirtied Blocks": 0,
                                            "Local Written Blocks": 0,
                                            "Temp Read Blocks": 0,
                                            "Temp Written Blocks": 0,
                                            "I/O Read Time": 0.000,
                                            "I/O Write Time": 0.000
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "Node Type": "CTE Scan",
                    "Parent Relationship": "Inner",
                    "Parallel Aware": false,
                    "CTE Name": "src",
                    "Alias": "src",
                    "Startup Cost": 0.00,
                    "Total Cost": 20.00,
                    "Plan Rows": 1000,
                    "Plan Width": 8,
                    "Actual Startup Time": 0.000,
                    "Actual Total Time": 0.000,
                    "Actual Rows": 0,
                    "Actual Loops": 0,
                    "Output": ["src.name", "src.created", "src.null_version", "src.delete_marker", "src.data_size", "src.data_md5", "src.mds_couple_id", "src.mds_key_version", "src.mds_key_uuid", "src.parts_count", "src.creator_id", "src.storage_class", "src.acl", "src.metadata", "src.parts"],
                    "Shared Hit Blocks": 0,
                    "Shared Read Blocks": 0,
                    "Shared Dirtied Blocks": 0,
                    "Shared Written Blocks": 0,
                    "Local Hit Blocks": 0,
                    "Local Read Blocks": 0,
                    "Local Dirtied Blocks": 0,
                    "Local Written Blocks": 0,
                    "Temp Read Blocks": 0,
                    "Temp Written Blocks": 0,
                    "I/O Read Time": 0.000,
                    "I/O Write Time": 0.000
                  }
                ]
              },
              {
                "Node Type": "Materialize",
                "Parent Relationship": "Inner",
                "Parallel Aware": false,
                "Startup Cost": 0.00,
                "Total Cost": 22.50,
                "Plan Rows": 1000,
                "Plan Width": 194,
                "Actual Startup Time": 0.001,
                "Actual Total Time": 0.001,
                "Actual Rows": 1,
                "Actual Loops": 1,
                "Output": ["o.name", "o.created", "o.null_version", "o.delete_marker", "o.data_size", "o.data_md5", "o.mds_couple_id", "o.mds_key_version", "o.mds_key_uuid", "o.parts_count", "o.creator_id", "o.storage_class", "o.acl", "o.metadata", "o.parts"],
                "Shared Hit Blocks": 0,
                "Shared Read Blocks": 0,
                "Shared Dirtied Blocks": 0,
                "Shared Written Blocks": 0,
                "Local Hit Blocks": 0,
                "Local Read Blocks": 0,
                "Local Dirtied Blocks": 0,
                "Local Written Blocks": 0,
                "Temp Read Blocks": 0,
                "Temp Written Blocks": 0,
                "I/O Read Time": 0.000,
                "I/O Write Time": 0.000,
                "Plans": [
                  {
                    "Node Type": "CTE Scan",
                    "Parent Relationship": "Outer",
                    "Parallel Aware": false,
                    "CTE Name": "src",
                    "Alias": "o",
                    "Startup Cost": 0.00,
                    "Total Cost": 20.00,
                    "Plan Rows": 1000,
                    "Plan Width": 194,
                    "Actual Startup Time": 0.000,
                    "Actual Total Time": 0.000,
                    "Actual Rows": 1,
                    "Actual Loops": 1,
                    "Output": ["o.name", "o.created", "o.null_version", "o.delete_marker", "o.data_size", "o.data_md5", "o.mds_couple_id", "o.mds_key_version", "o.mds_key_uuid", "o.parts_count", "o.creator_id", "o.storage_class", "o.acl", "o.metadata", "o.parts"],
                    "Shared Hit Blocks": 0,
                    "Shared Read Blocks": 0,
                    "Shared Dirtied Blocks": 0,
                    "Shared Written Blocks": 0,
                    "Local Hit Blocks": 0,
                    "Local Read Blocks": 0,
                    "Local Dirtied Blocks": 0,
                    "Local Written Blocks": 0,
                    "Temp Read Blocks": 0,
                    "Temp Written Blocks": 0,
                    "I/O Read Time": 0.000,
                    "I/O Write Time": 0.000
                  }
                ]
              }
            ]
          }
        ]
      },
      "Planning Time": 0.674,
      "Triggers": [
      ],
      "Execution Time": 7.623
    }
  ]
`;

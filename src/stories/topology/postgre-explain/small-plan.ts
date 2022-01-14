export const smallPlan = `
[
    {
      "Plan": {
        "Node Type": "Limit",
        "Parallel Aware": false,
        "Startup Cost": 3.51,
        "Total Cost": 3.52,
        "Plan Rows": 5,
        "Plan Width": 48,
        "Plans": [
          {
            "Node Type": "Sort",
            "Parent Relationship": "Outer",
            "Parallel Aware": false,
            "Startup Cost": 3.51,
            "Total Cost": 3.53,
            "Plan Rows": 9,
            "Plan Width": 48,
            "Sort Key": ["((ml.model ->> bookings.lang()))"],
            "Plans": [
              {
                "Node Type": "Seq Scan",
                "Parent Relationship": "Outer",
                "Parallel Aware": false,
                "Relation Name": "aircrafts_data",
                "Alias": "ml",
                "Startup Cost": 0.00,
                "Total Cost": 3.36,
                "Plan Rows": 9,
                "Plan Width": 48
              }
            ]
          }
        ]
      }
    }
  ]
`;

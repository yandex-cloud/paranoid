import _ from "lodash";
import {
  Link,
  GraphNode,
  TopologyNodeData,
  TopologyNodeDataStats,
  TopologyNodeDataStatsItem,
} from "../../../lib";

export interface BasicPlan {
  "Node Type": string;
  [key: string]: string;
}

export type Plan = BasicPlan & { Plans: Plan[] };
const durationField = "* Actual Duration";
const costField = "* Actual Cost";
const buffersField = "* Actual Shared Hit Blocks";
const ioField = "* Actual Shared Read Blocks";

const ioKeys = [
  buffersField,
  ioField,
  "Shared Hit Blocks",
  "Shared Read Blocks",
  "Shared Dirtied Blocks",
  "Shared Written Blocks",
  "Local Hit Blocks",
  "Local Read Blocks",
  "Local Dirtied Blocks",
  "Local Written Blocks",
  "Temp Read Blocks",
  "Temp Written Blocks",
  "I/O Read Time",
  "I/O Write Time",
];

function getNodeMeta(plan: Plan) {
  if (Array.isArray(plan["Sort Key"])) {
    return {
      key: "by",
      items: plan["Sort Key"],
    };
  } else if (plan["Join Type"]) {
    return {
      key: plan["Join Type"],
      items: ["join"],
    };
  } else if (plan["CTE Name"]) {
    return {
      key: "CTE",
      items: [plan["CTE Name"]],
    };
  }

  return undefined;
}

const statsName = "Stats";
const ioName = "I/O & Buffers";

function getStats(plan: Plan, customVals: TopologyNodeDataStatsItem[]) {
  const stats = Object.keys(plan).reduce((acc, key) => {
    if (key !== "Node Type" && key !== "Plans") {
      let value = plan[key];

      if (Array.isArray(value)) {
        value = value.join(",\n");
      }

      if (value) {
        acc.push({ name: key, value: String(value).split("<").join("<\n") });
      }
    }

    return acc;
  }, [] as TopologyNodeDataStatsItem[]);

  const filteredStats = stats.concat(customVals);
  const groupedStats = filteredStats.reduce(
    (acc, item) => {
      if (ioKeys.includes(item.name)) {
        acc[ioName].push(item);
      } else {
        acc[statsName].push(item);
      }
      return acc;
    },
    {
      [statsName]: [],
      [ioName]: [],
    } as Record<string, TopologyNodeDataStatsItem[]>
  );

  return Object.keys(groupedStats).reduce((acc, key) => {
    acc.push({
      group: key,
      stats: groupedStats[key],
    });
    return acc;
  }, [] as TopologyNodeDataStats[]);
}

function getNodeActualValue(field: string, plan: Plan) {
  let value = Number(plan[field]) || 0;

  if (Array.isArray(plan.Plans)) {
    const childrenTime = plan.Plans.reduce((acc, child) => {
      return acc + Number(child[field]);
    }, 0);

    value -= childrenTime;
  }

  return value < 0 ? 0 : Math.round(value * 100000) / 100000;
}

function getNodeFromPlan(plan: Plan, totalTime: number, index: number) {
  const time = getNodeActualValue("Actual Total Time", plan);
  const cost = getNodeActualValue("Total Cost", plan);
  const buffers = getNodeActualValue("Shared Hit Blocks", plan);
  const io = getNodeActualValue("Shared Read Blocks", plan);
  const stats = [
    { name: durationField, value: time },
    { name: costField, value: cost },
    { name: buffersField, value: buffers },
    { name: ioField, value: io },
  ];

  const data: TopologyNodeData = {
    name: plan["Node Type"],
    meta: getNodeMeta(plan),
    time,
    percent: Math.round((time / totalTime) * 100),
    stats: getStats(plan, stats),
    tags: [],
  };

  return {
    name: `${plan["Node Type"]}#${index}`,
    data,
  };
}

interface MaxInfo {
  id: string;
  max: number;
}

function setMax(info: MaxInfo, id: string, value: number) {
  if (info.max < value) {
    return {
      id,
      max: value,
    };
  }

  return info;
}

function pushTag(
  graphNode: GraphNode<TopologyNodeData>,
  maxInfo: MaxInfo,
  tagName: string
) {
  if (graphNode.name === maxInfo.id && graphNode.data && maxInfo.max > 0) {
    const random = Math.round(Math.random());

    graphNode.data.tags.push({
      value: tagName,
      theme: random === 0 ? "danger" : "warn",
    });
  }
}

function statByNameFactory(name: string) {
  return function (items: TopologyNodeDataStatsItem[]) {
    return Number(items.find((item) => item.name === name)?.value ?? 0);
  };
}

const getDurationStat = statByNameFactory(durationField);
const getCostStat = statByNameFactory(costField);
const getBuffersStat = statByNameFactory(buffersField);
const getIOStat = statByNameFactory(ioField);

export function parseExplain(query: string) {
  const result = JSON.parse(query) || [];
  const links: Link[] = [];
  const nodes: GraphNode<TopologyNodeData>[] = [];
  const explain = result[0];
  const rootPlan = _.get(explain, ["Plan"], {} as Plan);

  let maxDuration = { id: "", max: 0 };
  let maxCost = { id: "", max: 0 };
  let maxBuffers = { id: "", max: 0 };
  let maxIO = { id: "", max: 0 };

  if (!explain) {
    return { nodes, links };
  }
  let nodeIndex = 0;
  const totalTime = rootPlan["Actual Total Time"];

  function parsePlans(plans: Plan[] = [], from?: string) {
    plans.forEach((plan) => {
      const node = getNodeFromPlan(plan, totalTime, nodeIndex++);
      maxDuration = setMax(
        maxDuration,
        node.name,
        getDurationStat(node.data.stats[0].stats as TopologyNodeDataStatsItem[])
      );
      maxCost = setMax(
        maxCost,
        node.name,
        getCostStat(node.data.stats[0].stats as TopologyNodeDataStatsItem[])
      );
      maxBuffers = setMax(
        maxBuffers,
        node.name,
        getBuffersStat(node.data.stats[0].stats as TopologyNodeDataStatsItem[])
      );
      maxIO = setMax(
        maxIO,
        node.name,
        getIOStat(node.data.stats[0].stats as TopologyNodeDataStatsItem[])
      );

      nodes.push(node);

      if (from) {
        links.push({ from, to: node.name });
      }

      parsePlans(plan.Plans, node.name);
    });
  }

  parsePlans([rootPlan]);

  nodes.forEach((graphNode) => {
    pushTag(graphNode, maxDuration, "Slowest");
    pushTag(graphNode, maxCost, "Most expensive");
    pushTag(graphNode, maxBuffers, "Buffer heaviest");
    pushTag(graphNode, maxIO, "I/O heaviest");
  });

  return {
    links,
    nodes,
  };
}

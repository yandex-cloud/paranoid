import _ from "lodash";

import { PgHost, ClickhoseHost, RedisHost, MongodbHost } from "./data";
import { Link, GraphNode, TextOverflow } from "../lib/models";

export function getSidebarReadme(hosts: any[]) {
  const sidebar = hosts;
  return {
    readme: {
      sidebar: "\n```json\n" + JSON.stringify(sidebar, null, 2) + "\n```",
    },
  };
}

enum HostType {
  Master = "MASTER",
  Replica = "REPLICA",
}

export function prepareHosts(hosts: PgHost[]) {
  const master = hosts.find(({ role }) => role === HostType.Master) as PgHost;
  const links: Link[] = [];
  hosts.forEach((host) => {
    if (host.replicationSource) {
      links.push({
        from: host.replicationSource,
        to: host.name,
      });
    } else if (host.role === HostType.Replica) {
      links.push({
        from: master.name,
        to: host.name,
      });
    }
  });

  let group: string;
  const hostsWithoutReplicas = hosts.filter(
    ({ replicationSource }) => !replicationSource
  );
  if (links.length > 0 && hostsWithoutReplicas.length > 1 && master) {
    group = "HA-group";
  }

  const nodes: GraphNode[] = hosts.map((host) => ({
    name: host.name,
    status: host.health,
    meta: host.role,
    group: host.replicationSource ? undefined : group,
  }));
  return { nodes, links };
}

enum ClickHouseType {
  Zookeeper = "ZOOKEEPER",
  Clickhouse = "CLICKHOUSE",
}

export function prepareClickhouseHosts(hosts: ClickhoseHost[]) {
  const links: Link[] = [];

  const hasZk = hosts.some((hosts) => hosts.type === ClickHouseType.Zookeeper);
  if (hasZk) {
    const shards: string[] = [];
    hosts.forEach((host) => {
      const shard = host.shardName as string;
      if (host.type === ClickHouseType.Clickhouse && !shards.includes(shard)) {
        shards.push(shard);
        links.push({
          from: ClickHouseType.Zookeeper,
          to: shard,
        });
      }
    });
  }

  let nodes: GraphNode[] = hosts.map((host) => ({
    name: host.name,
    status: host.health,
    group: host.shardName ? host.shardName : host.type,
  }));

  if (nodes.length === 1) {
    nodes = nodes.map(({ name, status }) => ({ name, status }));
  }
  return { links, nodes };
}

export function prepareRedisHosts(hosts: RedisHost[], cluster: boolean) {
  const masters = new Map<string, RedisHost>();
  hosts.forEach((host) => {
    if (host.role === HostType.Master && host.shardName) {
      masters.set(host.shardName, host);
    }
  });
  const links = hosts.reduce((acc, host) => {
    const master = masters.get(host.shardName as string) as RedisHost;
    if (host.role === HostType.Replica) {
      acc.push({
        from: master.name,
        to: host.name,
      });
    }
    return acc;
  }, [] as Link[]);

  let nodes: GraphNode[] = hosts.map((host) => ({
    name: host.name,
    status: host.health,
    meta: host.role,
    group: host.shardName || undefined,
  }));

  if (!cluster) {
    nodes = nodes.map(({ name, status, meta }) => ({ name, status, meta }));
  }
  return { links, nodes };
}

export function prepareExplainData(tables: any) {
  const links: Link[] = [];
  const nodes: GraphNode[] = [];

  _.forEach(tables, (table) => {
    nodes.push({
      name: table.name,
    });

    const tableTypes: { [key: string]: number } = {};

    const { reads = [], writes = [] } = table;
    let prevEl: { type: string } | null = null;

    _.forEach([...reads, ...writes], (node) => {
      if (tableTypes[node.type]) {
        tableTypes[node.type] = tableTypes[node.type] + 1;
      } else {
        tableTypes[node.type] = 1;
      }

      const nodeId = getExplainNodeId(
        table.name,
        node.type,
        String(tableTypes[node.type])
      );

      let prevNodeId = table.name;
      if (prevEl) {
        prevNodeId =
          node.type === prevEl.type
            ? getExplainNodeId(
                table.name,
                prevEl.type,
                String(tableTypes[prevEl.type] - 1)
              )
            : getExplainNodeId(
                table.name,
                prevEl.type,
                String(tableTypes[prevEl.type])
              );
      }

      links.push({
        from: prevNodeId,
        to: nodeId,
      });
      nodes.push({
        name: nodeId,
        meta: getMetaForExplainNode(node),
      });

      prevEl = node;
    });
  });

  return { links, nodes };
}

function getStringFromProps(props: [string, string | string[] | undefined][]) {
  return props
    .map(([name, value]) => {
      return (
        value && `${name}: ${Array.isArray(value) ? value.join(", ") : value}`
      );
    })
    .filter(Boolean)
    .join("\n");
}

export function getMetaForExplainNode(node: any) {
  switch (node.type) {
    case "MultiLookup":
    case "Lookup": {
      return getStringFromProps([
        ["lookup by", node.lookup_by],
        ["columns", node.columns],
      ]);
    }
    case "FullScan":
    case "Scan": {
      return getStringFromProps([
        ["scan by", node.scan_by],
        ["limit", node.limit],
        ["columns", node.columns],
      ]);
    }
    case "Upsert":
    case "MultiUpsert": {
      return getStringFromProps([
        ["key", node.key],
        ["columns", node.columns],
      ]);
    }
    case "Erase":
    case "MultiErase": {
      return getStringFromProps([
        ["key", node.key],
        ["columns", node.columns],
      ]);
    }
    default:
      return "";
  }
}

function renderExplainNode(node: GraphNode) {
  const parts = node.name.split("|");
  return parts.length > 1 ? parts[1] : node.name;
}

function getExplainNodeId(...values: string[]) {
  return values.join("|");
}

export function getPropsForExplainStories() {
  return {
    textOverflow: TextOverflow.Normal,
    renderNodeTitle: renderExplainNode,
  };
}

enum MongoHost {
  Mongod = "MONGOD",
  Mongocfg = "MONGOCFG",
  Mongos = "MONGOS",
}

enum MongoRoles {
  Primary = "PRIMARY",
  Secondary = "SECONDARY",
}

function groupHosts(hosts: MongodbHost[]) {
  const mongod = hosts.filter(({ type }) => type === MongoHost.Mongod);
  const mongocfg = hosts.filter(({ type }) => type === MongoHost.Mongocfg);
  const mongos = hosts.filter(({ type }) => type === MongoHost.Mongos);
  const shards = mongod.reduce((acc, host) => {
    const name = host.shardName as string;
    if (acc[name]) {
      acc[name].push(host);
    } else {
      acc[name] = [host];
    }
    return acc;
  }, {} as Record<string, MongodbHost[]>);

  return { mongocfg, mongos, mongod: shards };
}

export function prepareMongodbHosts(hosts: MongodbHost[], sharded: boolean) {
  const groupedHosts = groupHosts(hosts);
  const nodes: GraphNode[] = [];
  const links: Link[] = [];

  const mongod = groupedHosts.mongod;
  Object.keys(mongod).forEach((shardName) => {
    const primaries: MongodbHost[] = [];

    mongod[shardName].forEach((host) => {
      if (host.role === MongoRoles.Primary) {
        primaries.push(host);
      }

      nodes.push({
        name: host.name,
        status: host.health,
        meta: host.role,
        group: sharded ? shardName : undefined,
      });
    });

    if (primaries.length < 2) {
      mongod[shardName].forEach((host) => {
        const primary = primaries[0];
        if (primary && host.role === MongoRoles.Secondary) {
          links.push({
            from: primary.name,
            to: host.name,
          });
        }
      });
    }
  });

  const mongos = groupedHosts.mongos;
  if (mongos) {
    mongos.forEach((host) => {
      nodes.push({
        name: host.name,
        status: host.health,
        meta: host.role,
        group: MongoHost.Mongos,
      });
    });

    links.push({
      from: "MONGOS",
      to: "MONGOCFG",
    });

    Object.keys(mongod).forEach((shardName) => {
      links.push({
        from: "MONGOS",
        to: shardName,
      });
    });
  }

  const mongocfg = groupedHosts.mongocfg;
  if (mongocfg) {
    const primaries: MongodbHost[] = [];
    mongocfg.forEach((host) => {
      if (host.role === MongoRoles.Primary) {
        primaries.push(host);
      }

      nodes.push({
        name: host.name,
        status: host.health,
        meta: host.role,
        group: MongoHost.Mongocfg,
      });
    });

    if (primaries.length < 2) {
      mongocfg.forEach((host) => {
        const primary = primaries[0];
        if (primary && host.role === MongoRoles.Secondary) {
          links.push({
            from: primary.name,
            to: host.name,
          });
        }
      });
    }
  }
  return { nodes, links };
}

export function renderTitle({ name }: GraphNode) {
  return name.split(".")[0];
}

export function onTitleClick(node: GraphNode) {
  console.log(JSON.stringify(node, null, 2));
}

export function prepareCopyText(node: GraphNode) {
  return node.name;
}

enum SubclusterRole {
  Master = "MASTERNODE",
  Data = "DATANODE",
  Compute = "COMPUTE",
}

interface Subcluster {
  name: string;
  hostsCount: number;
  subnetId: string;
  clusterId: string;
  assignPublicIp: boolean;
  id: string;
  createdAt: string;
  role: string;
}

interface DataprocHost {
  name: string;
  subclusterId: string;
  computeInstanceId: string;
  health: string;
  role: string;
  subcluster?: Subcluster;
}

export function prepareDataprocHosts(hosts: DataprocHost[]) {
  const subclusters: Subcluster[] = _.uniqBy(
    hosts.map((host) => host.subcluster as Subcluster),
    "id"
  );
  const masterSubcluster = subclusters.find(
    ({ role }) => role === SubclusterRole.Master
  ) as Subcluster;
  const from = masterSubcluster.name;
  const links: Link[] = [];
  subclusters.forEach((subcluster) => {
    if (subcluster.role !== SubclusterRole.Master) {
      links.push({
        from,
        to: subcluster.name,
      });
    }
  });
  const nodes: GraphNode[] = hosts.map((host) => ({
    name: host.name as string,
    status: host.health as string,
    meta: host.role as string,
    group: _.get(host, ["subcluster", "name"]),
    computeInstanceId: host.computeInstanceId,
  }));

  return { links, nodes };
}

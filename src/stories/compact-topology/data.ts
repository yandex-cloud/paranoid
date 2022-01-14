export interface PgHost {
  name: string;
  role: string;
  health: string;
  replicationSource?: string;
  metrics?: Array<{ name: string; value: string }>;
}

export interface ClickhoseHost {
  name: string;
  type: string;
  health: string;
  shardName?: string | null;
}

export interface RedisHost {
  name: string;
  role: string;
  health: string;
  shardName?: string | null;
}

export interface MongodbHost {
  name: string;
  type: string;
  health: string;
  shardName?: string | null;
  role: string;
}

export const POSTGRES_REPLICAS = [
  {
    name: "rc1a-2b6ebfidixy25bmb.mdb.cloud-preprod.yandex.net",
    role: "MASTER",
    health: "ALIVE",
    metrics: [
      {
        name: "CPU",
        value: "53%",
      },
      {
        name: "Memory",
        value: "92%",
        theme: "warning",
      },
      {
        name: "Disk",
        value: "95%",
        theme: "danger",
      },
    ],
  },
  {
    name: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    health: "ALIVE",
    metrics: [],
  },
  {
    name: "rc1a-njp5o1apsml63uly.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    replicationSource: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    name: "rc1b-nf12pquuaif81qsa.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    health: "UNKNOWN",
  },
  {
    name: "rc1b-z8tvv8ts2nvur6nq.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    health: "ALIVE",
  },
  {
    name: "rc1b-9zoky845krc2z82e.mdb.cloud-preprod.yandex.net",
    replicationSource: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
    health: "DEGRADED",
    role: "REPLICA",
  },
];

export const POSTGRES_MASTER_REPLICATION_SOURCE = [
  {
    name: "rc1a-2b6ebfidixy25bmb.mdb.cloud-preprod.yandex.net",
    role: "MASTER",
    health: "ALIVE",
  },
  {
    name: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    health: "ALIVE",
  },
  {
    name: "rc1a-njp5o1apsml63uly.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    replicationSource: "rc1a-2b6ebfidixy25bmb.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    name: "rc1b-nf12pquuaif81qsa.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    health: "UNKNOWN",
  },
];

export const POSTGRES_REPLICAS_UNKNOWN_STATUS = [
  {
    name: "rc1a-2b6ebfidixy25bmb.mdb.cloud-preprod.yandex.net",
    role: "UNKNOWN",
    health: "UNKNOWN",
  },
  {
    name: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
    role: "UNKNOWN",
    health: "UNKNOWN",
  },
  {
    name: "rc1a-njp5o1apsml63uly.mdb.cloud-preprod.yandex.net",
    role: "UNKNOWN",
    health: "UNKNOWN",
  },
  {
    name: "rc1b-nf12pquuaif81qsa.mdb.cloud-preprod.yandex.net",
    role: "UNKNOWN",
    health: "UNKNOWN",
  },
  {
    name: "rc1b-z8tvv8ts2nvur6nq.mdb.cloud-preprod.yandex.net",
    role: "UNKNOWN",
    health: "UNKNOWN",
  },
  {
    name: "rc1b-9zoky845krc2z82e.mdb.cloud-preprod.yandex.net",
    health: "UNKNOWN",
    role: "UNKNOWN",
  },
];

export const POSTGRES_REPLICAS_UNKNOWN_STATUS_WITH_REPLICATION_SOURCE = [
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1a-2b6ebfidixy25bmb.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    replicationSource: "rc1b-z8tvv8ts2nvur6nq.mdb.cloud-preprod.yandex.net",
    name: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    replicationSource: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
    name: "rc1a-njp5o1apsml63uly.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    replicationSource: "rc1a-gloxi5s2vqd8cs41.mdb.cloud-preprod.yandex.net",
    name: "rc1b-9zoky845krc2z82e.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1b-nf12pquuaif81qsa.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1b-z8tvv8ts2nvur6nq.mdb.cloud-preprod.yandex.net",
  },
];

export const MYSQL_HOSTS = [
  {
    health: "ALIVE",
    role: "REPLICA",
    name: "rc1a-ieemd67diaq7aboi.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "ALIVE",
    role: "REPLICA",
    name: "rc1a-rzsylapc0jx2fyu2.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "ALIVE",
    role: "REPLICA",
    name: "rc1b-ggtoxv675axlviki.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "ALIVE",
    role: "MASTER",
    name: "rc1b-zx2t1bw2nrnjj9z3.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "ALIVE",
    role: "REPLICA",
    name: "rc1c-amj5v5tr7aiiuia4.mdb.cloud-preprod.yandex.net",
  },
];

export const MYSQL_HOSTS_UNKNOWN = [
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1a-ieemd67diaq7aboi.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1a-rzsylapc0jx2fyu2.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1b-ggtoxv675axlviki.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1b-zx2t1bw2nrnjj9z3.mdb.cloud-preprod.yandex.net",
  },
  {
    health: "UNKNOWN",
    role: "UNKNOWN",
    name: "rc1c-amj5v5tr7aiiuia4.mdb.cloud-preprod.yandex.net",
  },
];

export const CLICKHOUSE_DEAD_HOST = [
  {
    health: "DEAD",
    name: "rc1b-7exgzf5hzcy8b98h.mdb.cloud-preprod.yandex.net",
    shardName: "shard1",
    type: "CLICKHOUSE",
  },
];

export const CLICKHOUSE_HA_CONFIGURATION = [
  {
    health: "ALIVE",
    type: "ZOOKEEPER",
    name: "rc1a-2y3bld4hbvad3eo3.mdb.cloud-preprod.yandex.net",
    shardName: null,
  },
  {
    health: "ALIVE",
    type: "CLICKHOUSE",
    name: "rc1a-v9jjlgunrgakvygh.mdb.cloud-preprod.yandex.net",
    shardName: "shard1",
  },
  {
    health: "ALIVE",
    type: "CLICKHOUSE",
    name: "rc1b-1zvzfcer95kb0rjj.mdb.cloud-preprod.yandex.net",
    shardName: "shard1",
  },
  {
    health: "ALIVE",
    type: "ZOOKEEPER",
    name: "rc1b-b4i05fqpnuiep9u9.mdb.cloud-preprod.yandex.net",
    shardName: null,
  },
  {
    health: "ALIVE",
    type: "ZOOKEEPER",
    name: "rc1c-cbyvthgmgogbflru.mdb.cloud-preprod.yandex.net",
    shardName: null,
  },
];

export const CLICKHOUSE_SHARDS = [
  {
    type: "CLICKHOUSE",
    shardName: "shard3",
    name: "rc1b-h991yib5a1x3asmx.mdb.cloud-preprod.yandex.net",
    health: "DEAD",
  },
  {
    type: "CLICKHOUSE",
    shardName: "shard2",
    name: "rc1b-s26u9m5k898mhjy7.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "CLICKHOUSE",
    shardName: "shard1",
    name: "rc1b-v78a6vl3i98teca1.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
];

export const CLICKHOUSE_SHARDS_WITH_ZK = [
  {
    type: "ZOOKEEPER",
    name: "rc1a-2y3bld4hbvad3eo3.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "CLICKHOUSE",
    shardName: "shard2",
    name: "rc1a-8qc53o4czdjynu3t.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "CLICKHOUSE",
    shardName: "shard1",
    name: "rc1a-v9jjlgunrgakvygh.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "CLICKHOUSE",
    shardName: "shard1",
    name: "rc1b-1zvzfcer95kb0rjj.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "ZOOKEEPER",
    name: "rc1b-b4i05fqpnuiep9u9.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "CLICKHOUSE",
    shardName: "shard2",
    name: "rc1b-bfv8rwlest7lsxqg.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "ZOOKEEPER",
    name: "rc1c-cbyvthgmgogbflru.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
  {
    type: "CLICKHOUSE",
    shardName: "shard2",
    name: "rc1c-wsxg8gunfc1qwimn.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
];

export const REDIS_HOST = [
  {
    role: "MASTER",
    shardName: "shard1",
    name: "rc1b-4y624dknc11zq1on.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
  },
];

export const REDIS_HOSTS = [
  {
    zoneId: "ru-central1-a",
    name: "rc1a-nqx2qp79qasri43v.mdb.cloud-preprod.yandex.net",
    role: "MASTER",
    shardName: "shard1",
    health: "ALIVE",
  },
  {
    name: "rc1b-om5v9u0s1yz4eo5a.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard1",
    health: "ALIVE",
  },
  {
    name: "rc1c-jr5ajpg3qxpgrfvj.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard1",
    health: "ALIVE",
  },
];

export const REDIS_SHARDS = [
  {
    name: "rc1a-824xx1xeb76jea30.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard03",
    health: "ALIVE",
  },
  {
    name: "rc1a-8d2h2dzqa0h85zlx.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard03",
    health: "ALIVE",
  },
  {
    name: "rc1a-m0iolva0qjxsisba.mdb.cloud-preprod.yandex.net",
    role: "MASTER",
    shardName: "shard03",
    health: "ALIVE",
  },
  {
    name: "rc1b-3dhpq5a6vv109rpg.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard02",
    health: "ALIVE",
  },
  {
    name: "rc1b-7aorie9qibidbuk4.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard01",
    health: "ALIVE",
  },
  {
    name: "rc1b-jrbg2u7z68l1gsg4.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard02",
    health: "ALIVE",
  },
  {
    name: "rc1c-4w40ueelp7e31l6q.mdb.cloud-preprod.yandex.net",
    role: "MASTER",
    shardName: "shard02",
    health: "ALIVE",
  },
  {
    name: "rc1c-f4tibdh3lx1tg95w.mdb.cloud-preprod.yandex.net",
    role: "MASTER",
    shardName: "shard01",
    health: "ALIVE",
  },
  {
    name: "rc1c-yrz3an2s27z746ni.mdb.cloud-preprod.yandex.net",
    role: "REPLICA",
    shardName: "shard01",
    health: "ALIVE",
  },
];

export const MONGODB_HOST = [
  {
    name: "rc1b-zo11fnjasdez0g5q.mdb.cloud-preprod.yandex.net",
    shardName: "rs01",
    role: "PRIMARY",
    health: "UNKNOWN",
    type: "MONGOD",
  },
];

export const MONGODB_HOSTS = [
  {
    name: "rc1a-dk094e8agc42fr6h.mdb.cloud-preprod.yandex.net",
    shardName: "rs01",
    role: "PRIMARY",
    health: "ALIVE",
    type: "MONGOD",
  },
  {
    name: "rc1b-nuok8ewx50mxun44.mdb.cloud-preprod.yandex.net",
    shardName: "rs01",
    role: "SECONDARY",
    health: "UNKNOWN",
    type: "MONGOD",
  },
];

export const MONGODB_SHARDS = [
  {
    name: "rc1a-dl69g8vfeyrvlot7.mdb.cloud-preprod.yandex.net",
    shardName: null,
    role: "PRIMARY",
    health: "ALIVE",
    type: "MONGOS",
  },
  {
    name: "rc1a-gg66g9pjkflygoeh.mdb.cloud-preprod.yandex.net",
    shardName: "rs01",
    role: "SECONDARY",
    health: "ALIVE",
    type: "MONGOD",
  },
  {
    name: "rc1a-nixt1pi43t8yn8xn.mdb.cloud-preprod.yandex.net",
    shardName: null,
    role: "SECONDARY",
    health: "ALIVE",
    type: "MONGOCFG",
  },
  {
    name: "rc1a-rybqqfajjyye4fv9.mdb.cloud-preprod.yandex.net",
    shardName: null,
    role: "PRIMARY",
    health: "ALIVE",
    type: "MONGOS",
  },
  {
    name: "rc1b-br0y3w5glesox61w.mdb.cloud-preprod.yandex.net",
    shardName: null,
    role: "PRIMARY",
    health: "ALIVE",
    type: "MONGOS",
  },
  {
    name: "rc1b-onpnc8fj3p2azoh7.mdb.cloud-preprod.yandex.net",
    shardName: "rs01",
    role: "PRIMARY",
    health: "ALIVE",
    type: "MONGOD",
  },
  {
    name: "rc1b-v198o31ygda8wl4f.mdb.cloud-preprod.yandex.net",
    shardName: null,
    role: "SECONDARY",
    health: "ALIVE",
    type: "MONGOCFG",
  },
  {
    name: "rc1c-vthmgy99lym2m5ej.mdb.cloud-preprod.yandex.net",
    shardName: null,
    role: "PRIMARY",
    health: "ALIVE",
    type: "MONGOCFG",
  },
  {
    name: "rc1b-zo11fnjasdez0g5q.mdb.cloud-preprod.yandex.net",
    shardName: "rs02",
    role: "PRIMARY",
    health: "UNKNOWN",
    type: "MONGOD",
  },
];

export const DATAPROC = [
  {
    subclusterId: "e4u24e6jjrnhjjdhak53",
    name: "rc1b-dataproc-c-1s1fdh8cuqmp5cbh.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8r67v417nr6cq9a1r9q",
    role: "COMPUTENODE",
    subcluster: {
      name: "topology_subcluster641",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4u24e6jjrnhjjdhak53",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "COMPUTENODE",
      hostsCount: 3,
    },
  },
  {
    subclusterId: "e4u24e6jjrnhjjdhak53",
    name: "rc1b-dataproc-c-e6q54yjf4fprw477.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rl7en56cmjmjtqc1kg",
    role: "COMPUTENODE",
    subcluster: {
      name: "topology_subcluster641",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4u24e6jjrnhjjdhak53",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "COMPUTENODE",
      hostsCount: 3,
    },
  },
  {
    subclusterId: "e4u24e6jjrnhjjdhak53",
    name: "rc1b-dataproc-c-z23zetsw4sdzqkno.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rmdv4hhls2vkuaf3l0",
    role: "COMPUTENODE",
    subcluster: {
      name: "topology_subcluster641",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4u24e6jjrnhjjdhak53",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "COMPUTENODE",
      hostsCount: 3,
    },
  },
  {
    subclusterId: "e4ul13v2ibn2ioloi3hh",
    name: "rc1b-dataproc-d-01hk1o0ozecj493b.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rvje667lbn4ng341js",
    role: "DATANODE",
    subcluster: {
      name: "topology_subcluster960",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4ul13v2ibn2ioloi3hh",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "DATANODE",
      hostsCount: 5,
    },
  },
  {
    subclusterId: "e4ul13v2ibn2ioloi3hh",
    name: "rc1b-dataproc-d-bjnwgcg7ho7mpgc8.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rgiti2mnasih3959uh",
    role: "DATANODE",
    subcluster: {
      name: "topology_subcluster960",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4ul13v2ibn2ioloi3hh",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "DATANODE",
      hostsCount: 5,
    },
  },
  {
    subclusterId: "e4ul13v2ibn2ioloi3hh",
    name: "rc1b-dataproc-d-ehlkceve2xasu39b.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8r7adfo8v3f2f0en73t",
    role: "DATANODE",
    subcluster: {
      name: "topology_subcluster960",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4ul13v2ibn2ioloi3hh",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "DATANODE",
      hostsCount: 5,
    },
  },
  {
    subclusterId: "e4ut9nmrs662lvoo5j96",
    name: "rc1b-dataproc-d-hl19tjn9qt2lu45k.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8r4o7j1foljdb4fd9k5",
    role: "DATANODE",
    subcluster: {
      name: "dataproc761_subcluster906",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-hdd",
      },
      id: "e4ut9nmrs662lvoo5j96",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "DATANODE",
      hostsCount: 2,
    },
  },
  {
    subclusterId: "e4ul13v2ibn2ioloi3hh",
    name: "rc1b-dataproc-d-mi0pp63tmaqs0d17.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rnntolt2sjvf048d44",
    role: "DATANODE",
    subcluster: {
      name: "topology_subcluster960",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4ul13v2ibn2ioloi3hh",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "DATANODE",
      hostsCount: 5,
    },
  },
  {
    subclusterId: "e4ul13v2ibn2ioloi3hh",
    name: "rc1b-dataproc-d-y4c1sawcyixv31bq.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rcqp3g5l2suvm515jm",
    role: "DATANODE",
    subcluster: {
      name: "topology_subcluster960",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4ul13v2ibn2ioloi3hh",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "DATANODE",
      hostsCount: 5,
    },
  },
  {
    subclusterId: "e4ut9nmrs662lvoo5j96",
    name: "rc1b-dataproc-d-z2o5u6pim2t1ewfc.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rgu3b5eeuat1re0c4n",
    role: "DATANODE",
    subcluster: {
      name: "dataproc761_subcluster906",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-hdd",
      },
      id: "e4ut9nmrs662lvoo5j96",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "DATANODE",
      hostsCount: 2,
    },
  },
  {
    subclusterId: "e4uisg2m0h310ib8al9t",
    name: "rc1b-dataproc-m-igbqsyix1rmorf1t.mdb.cloud-preprod.yandex.net",
    health: "ALIVE",
    computeInstanceId: "c8rlbk59fv4cmhh4ah7m",
    role: "MASTERNODE",
    subcluster: {
      name: "dataproc761_subcluster709",
      clusterId: "e4uf22c24vgthb8qa492",
      resources: {
        diskSize: 16106127360,
        resourcePresetId: "b2.small",
        diskTypeId: "network-ssd",
      },
      id: "e4uisg2m0h310ib8al9t",
      assignPublicIp: false,
      subnetId: "bltdsp5asmqo4gcd44pu",
      createdAt: "2020-03-30T13:42:16.983065+00:00",
      role: "MASTERNODE",
      hostsCount: 1,
    },
  },
];

export const EXPLAIN_1 = [
  {
    name: "/path/to/table1",
    reads: [
      {
        type: "FullScan",
        scan_by: ["id"],
        columns: ["id"],
      },
    ],
    writes: [
      {
        type: "MultiUpsert",
        key: ["id (expr)"],
        columns: ["text"],
      },
    ],
  },
  {
    name: "path/to/table2",
    reads: [
      {
        type: "MultiLookup",
        lookup_by: ["id (expr)"],
        columns: ["id"],
      },
    ],
  },
];

export const EXPLAIN_2 = [
  {
    name: "/pre-prod_global/ycloud/hardware/default/compute_az/pending_delayed_changes",
    reads: [
      {
        type: "Lookup",
        lookup_by: ['zone_id ("ru-central1-a")'],
        scan_by: ["target_id", "update_type"],
        columns: [
          "age",
          "last_processed",
          "last_updated",
          "target_id",
          "update_type",
          "zone_id",
        ],
      },
      {
        type: "Lookup",
        lookup_by: ['zone_id ("ru-central1-b")'],
        scan_by: ["target_id", "update_type"],
        columns: [
          "age",
          "last_processed",
          "last_updated",
          "target_id",
          "update_type",
          "zone_id",
        ],
      },
      {
        type: "Lookup",
        lookup_by: ['zone_id ("ru-central1-c")'],
        scan_by: ["target_id", "update_type"],
        columns: [
          "age",
          "last_processed",
          "last_updated",
          "target_id",
          "update_type",
          "zone_id",
        ],
      },
    ],
  },
];

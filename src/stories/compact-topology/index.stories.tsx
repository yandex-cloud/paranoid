import React from "react";
import { storiesOf } from "@storybook/react";

import StoryRoot from "./StoryRoot";
import { StoryCarousel } from "./StoryCarousel";

import {
  getSidebarReadme,
  prepareHosts,
  prepareClickhouseHosts,
  prepareRedisHosts,
  prepareMongodbHosts,
  prepareDataprocHosts,
  getPropsForExplainStories,
  prepareExplainData,
} from "./utils";
import hugeMongodbData from "./dataHugeMongo";
import hugeCHData from "./dataHugeCH";

import * as data from "./data";
import { LinkType } from "../../lib/models";

const pgStories = storiesOf("PostgreSQL", module);

pgStories.add(
  "PostgreSQL Replicas",
  () => {
    return <StoryRoot data={prepareHosts(data.POSTGRES_REPLICAS)} />;
  },
  getSidebarReadme(data.POSTGRES_REPLICAS)
);

pgStories.add(
  "PostgreSQL Replication Source from master",
  () => {
    return (
      <StoryRoot data={prepareHosts(data.POSTGRES_MASTER_REPLICATION_SOURCE)} />
    );
  },
  getSidebarReadme(data.POSTGRES_MASTER_REPLICATION_SOURCE)
);

pgStories.add(
  "PostgreSQL Replicas Unknown",
  () => {
    return (
      <StoryRoot data={prepareHosts(data.POSTGRES_REPLICAS_UNKNOWN_STATUS)} />
    );
  },
  getSidebarReadme(data.POSTGRES_REPLICAS_UNKNOWN_STATUS)
);

pgStories.add(
  "PostgreSQL Replicas Unknown with replica sources",
  () => {
    return (
      <StoryRoot
        data={prepareHosts(
          data.POSTGRES_REPLICAS_UNKNOWN_STATUS_WITH_REPLICATION_SOURCE
        )}
      />
    );
  },
  getSidebarReadme(
    data.POSTGRES_REPLICAS_UNKNOWN_STATUS_WITH_REPLICATION_SOURCE
  )
);

pgStories.add("PostgreSQL carousel", () => {
  return (
    <StoryCarousel
      datas={[
        prepareHosts(data.POSTGRES_REPLICAS),
        prepareHosts(data.POSTGRES_MASTER_REPLICATION_SOURCE),
        prepareHosts(data.POSTGRES_REPLICAS_UNKNOWN_STATUS),
        prepareHosts(
          data.POSTGRES_REPLICAS_UNKNOWN_STATUS_WITH_REPLICATION_SOURCE
        ),
      ]}
    />
  );
});

const mysqlStories = storiesOf("MySQL", module).addParameters({
  options: {
    showPanel: true,
  },
});

mysqlStories.add(
  "Mysql Replicas",
  () => {
    return <StoryRoot data={prepareHosts(data.MYSQL_HOSTS)} />;
  },
  getSidebarReadme(data.MYSQL_HOSTS)
);

mysqlStories.add(
  "Mysql Replicas Unknown",
  () => {
    return <StoryRoot data={prepareHosts(data.MYSQL_HOSTS_UNKNOWN)} />;
  },
  getSidebarReadme(data.MYSQL_HOSTS_UNKNOWN)
);

mysqlStories.add("Mysql carousel", () => {
  return (
    <StoryCarousel
      datas={[
        prepareHosts(data.MYSQL_HOSTS),
        prepareHosts(data.MYSQL_HOSTS_UNKNOWN),
      ]}
    />
  );
});

const clickhouseStories = storiesOf("ClickHouse", module).addParameters({
  options: {
    showPanel: true,
  },
});

clickhouseStories.add(
  "ClickHouse DEAD host",
  () => {
    return (
      <StoryRoot data={prepareClickhouseHosts(data.CLICKHOUSE_DEAD_HOST)} />
    );
  },
  getSidebarReadme(data.CLICKHOUSE_DEAD_HOST)
);

clickhouseStories.add(
  "ClickHouse Shards",
  () => {
    return (
      <StoryRoot
        data={prepareClickhouseHosts(data.CLICKHOUSE_SHARDS)}
        linkType={LinkType.Line}
      />
    );
  },
  getSidebarReadme(data.CLICKHOUSE_SHARDS)
);

clickhouseStories.add(
  "ClickHouse HA configuration",
  () => {
    return (
      <StoryRoot
        data={prepareClickhouseHosts(data.CLICKHOUSE_HA_CONFIGURATION)}
        linkType={LinkType.Line}
      />
    );
  },
  getSidebarReadme(data.CLICKHOUSE_HA_CONFIGURATION)
);

clickhouseStories.add(
  "ClickHouse Shards and ZooKeeper",
  () => {
    return (
      <StoryRoot
        data={prepareClickhouseHosts(data.CLICKHOUSE_SHARDS_WITH_ZK)}
        linkType={LinkType.Line}
      />
    );
  },
  getSidebarReadme(data.CLICKHOUSE_SHARDS_WITH_ZK)
);

clickhouseStories.add(
  "ClickHouse Huge cluster",
  () => {
    return (
      <StoryRoot
        data={prepareClickhouseHosts(hugeCHData)}
        linkType={LinkType.Line}
      />
    );
  },
  getSidebarReadme(hugeCHData)
);

const redisStories = storiesOf("Redis", module).addParameters({
  options: {
    showPanel: true,
  },
});

redisStories.add(
  "Redis host",
  () => {
    return <StoryRoot data={prepareRedisHosts(data.REDIS_HOST, false)} />;
  },
  getSidebarReadme(data.REDIS_HOST)
);

redisStories.add(
  "Redis hosts",
  () => {
    return <StoryRoot data={prepareRedisHosts(data.REDIS_HOSTS, false)} />;
  },
  getSidebarReadme(data.REDIS_HOSTS)
);

redisStories.add(
  "Redis shards",
  () => {
    return <StoryRoot data={prepareRedisHosts(data.REDIS_SHARDS, true)} />;
  },
  getSidebarReadme(data.REDIS_SHARDS)
);

const mongodbStories = storiesOf("MongoDB", module).addParameters({
  options: {
    showPanel: true,
  },
});

mongodbStories.add(
  "MongoDB host",
  () => {
    return <StoryRoot data={prepareMongodbHosts(data.MONGODB_HOST, false)} />;
  },
  getSidebarReadme(data.MONGODB_HOST)
);

mongodbStories.add(
  "MongoDB hosts",
  () => {
    return <StoryRoot data={prepareMongodbHosts(data.MONGODB_HOSTS, false)} />;
  },
  getSidebarReadme(data.MONGODB_HOSTS)
);

mongodbStories.add(
  "MongoDB shards",
  () => {
    return <StoryRoot data={prepareMongodbHosts(data.MONGODB_SHARDS, true)} />;
  },
  getSidebarReadme(data.MONGODB_SHARDS)
);

mongodbStories.add(
  "MongoDB huge cluster",
  () => {
    return <StoryRoot data={prepareMongodbHosts(hugeMongodbData, true)} />;
  },
  getSidebarReadme(hugeMongodbData)
);

mongodbStories.add("MongoDB carousel", () => {
  return (
    <StoryCarousel
      datas={[
        prepareMongodbHosts(data.MONGODB_HOST, false),
        prepareMongodbHosts(data.MONGODB_HOSTS, false),
        prepareMongodbHosts(data.MONGODB_SHARDS, true),
        prepareMongodbHosts(hugeMongodbData, true),
      ]}
    />
  );
});

const dataprocStories = storiesOf("DataProc", module).addParameters({
  options: {
    showPanel: true,
  },
});

dataprocStories.add(
  "Dataproc",
  () => {
    return (
      <StoryRoot
        data={prepareDataprocHosts(data.DATAPROC)}
        linkType={LinkType.Line}
      />
    );
  },
  getSidebarReadme(data.DATAPROC)
);

const explainStories = storiesOf("Query explain", module).addParameters({
  options: {
    showPanel: true,
  },
});

explainStories.add("Example 1", () => {
  return (
    <StoryRoot
      data={prepareExplainData(data.EXPLAIN_1)}
      {...getPropsForExplainStories()}
    />
  );
});

explainStories.add("Example 2", () => {
  return (
    <StoryRoot
      data={prepareExplainData(data.EXPLAIN_2)}
      {...getPropsForExplainStories()}
    />
  );
});

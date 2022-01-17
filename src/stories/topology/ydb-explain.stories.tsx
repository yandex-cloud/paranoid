import React from "react";
import { storiesOf } from "@storybook/react";
import { parseExplain } from "./ydb-explain/utils";
import { Story } from "./ydb-explain/Story";
import explain1 from "./ydb-explain/explain-1.json";
import explain2 from "./ydb-explain/explain-2.json";
import explain3 from "./ydb-explain/explain-3.json";
import explain4 from "./ydb-explain/explain-4.json";
import explain5 from "./ydb-explain/explain-5.json";

const ydbExplainStories = storiesOf("YDB explain", module);

ydbExplainStories.add("Explain 1", () => {
  return <Story data={parseExplain(explain1)} />;
});

ydbExplainStories.add("Explain 2", () => {
  return <Story data={parseExplain(explain2)} />;
});

ydbExplainStories.add("Explain 3", () => {
  return <Story data={parseExplain(explain3)} />;
});

ydbExplainStories.add("Explain 4", () => {
  return <Story data={parseExplain(explain4)} />;
});

ydbExplainStories.add("Explain 5", () => {
  return <Story data={parseExplain(explain5)} />;
});

import { Panel } from "./panel";
import DataRow from "./data-row";

export default function BusinessIntelligencePanel() {
  return (
    <Panel eyebrow="Business" title="Business Intelligence" status="monitoring">
      <div className="space-y-1">
        <DataRow
          label="Today's Revenue"
          value="R 84,240"
          detail="vs previous period"
          tone="good"
        />
        <DataRow
          label="Transactions"
          value="1,284"
          detail="processed today"
        />
        <DataRow
          label="Orders"
          value="642"
          detail="merchant activity"
        />
        <DataRow
          label="Customers"
          value="318"
          detail="active today"
        />
      </div>
    </Panel>
  );
}

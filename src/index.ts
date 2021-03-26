import { ReportBase } from "istanbul-lib-report";
import type {
  Context,
  FileContentWriter,
  ReportNode,
} from "istanbul-lib-report";

const reportKeys = ["lines", "statements", "functions", "branches"] as const;

export = class BadgesReporter extends ReportBase {
  onStart(root: ReportNode, context: Context) {
    const summary = root.getCoverageSummary(false);

    reportKeys.forEach((key) => {
      const total = summary.data[key];
      const file = `badges/${key}.svg`;
      const contentWriter = context.writer.writeFile(file) as FileContentWriter;
      contentWriter.write(createBadgeSvg(key, total.pct));
    });
  }
};

function getColour(percent: number): string {
  if (percent < 80) {
    return "red";
  }

  if (percent < 90) {
    return "yellow";
  }

  return "brightgreen";
}

function createBadgeSvg(key: string, percent: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="116" height="20">
   <linearGradient id="b" x2="0" y2="100%">
     <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
     <stop offset="1" stop-opacity=".1"/>
   </linearGradient>
 
   <mask id="a">
     <rect width="116" height="20" rx="3" fill="#fff"/>
   </mask>
 
   <g mask="url(#a)">
     <path fill="#555"
           d="M0 0 h62 v20 H0 z"/>
     <path fill="${getColour(percent)}"
           d="M62 0 h54 v20 H62 z"/>
     <path fill="url(#b)"
           d="M0 0 h116 v20 H0 z"/>
   </g>
 
   <g fill="#fff" text-anchor="middle">
     <g font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
       <text x="31" y="15" fill="#010101" fill-opacity=".3">
         coverage
       </text>
       <text x="31" y="14">
         coverage
       </text>
       <text x="89" y="15" fill="#010101" fill-opacity=".3">
         ${percent}%
       </text>
       <text x="89" y="14">
       ${percent}%
       </text>
     </g>
   </g>
 </svg>
 `;
}

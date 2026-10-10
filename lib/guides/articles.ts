export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  body: string; // HTML
}

export const ARTICLES: GuideArticle[] = [
  {
    slug: 'what-is-spc',
    title: 'What is Statistical Process Control?',
    description:
      'An introduction to SPC — why healthcare and improvement teams use it to understand variation in their data.',
    body: `
<p>Statistical Process Control (SPC) is a method for monitoring, controlling, and improving a process over time by tracking variation in your data. Originally developed by Walter Shewhart at Bell Labs in the 1920s, SPC was adopted widely in manufacturing quality improvement and later became a cornerstone of healthcare quality improvement.</p>

<h2>Why SPC matters</h2>
<p>Every process has variation. The critical question is: <strong>is this variation normal (expected) or is something different happening?</strong> Traditional methods such as comparing two time points or plotting monthly averages hide the story in your data. SPC charts display your data over time and use statistical limits to help you distinguish between the two types of variation:</p>
<ul>
  <li><strong>Common cause variation</strong> — random, inherent to the process, predictable within limits</li>
  <li><strong>Special cause variation</strong> — a signal that something has genuinely changed</li>
</ul>

<h2>How an SPC chart works</h2>
<p>An SPC chart plots each data point in time order. It calculates a <strong>centre line</strong> (mean or median) and <strong>control limits</strong> — upper and lower bounds that represent the expected range of variation. Points outside the limits, or unusual patterns within them, indicate special cause variation.</p>

<h2>SPC in the NHS — Making Data Count</h2>
<p>NHS England's <em>Making Data Count</em> (MDC) programme has adopted SPC as the standard approach to displaying and interpreting NHS performance data. The programme defines four rules for detecting special cause variation and a set of icons for communicating findings consistently.</p>
<p>This tool follows the MDC methodology, including the four variation rules and the XmR control chart recipe (mean ± 3-sigma limits using the average moving range).</p>
    `,
  },
  {
    slug: 'xmr-charts',
    title: 'XmR Charts — Individuals and Moving Range',
    description:
      'How XmR (Individuals and Moving Range) charts work, when to use them, and how limits are calculated.',
    body: `
<p>The XmR chart — also called the Individuals and Moving Range chart — is the most commonly used SPC chart for continuous data. It is the default chart type in this tool and is recommended by NHS England's Making Data Count programme for most healthcare metrics.</p>

<h2>When to use an XmR chart</h2>
<p>Use an XmR chart when:</p>
<ul>
  <li>You have a single measurement per time period (e.g. monthly A&amp;E 4-hour performance)</li>
  <li>Your data is continuous (not a proportion or count of rare events)</li>
  <li>You have at least 12–15 data points</li>
</ul>

<h2>How the limits are calculated</h2>
<p>XmR limits use the <strong>average moving range</strong> method:</p>
<ol>
  <li>Calculate the <strong>mean</strong> of all data points</li>
  <li>Calculate the <strong>moving range</strong> — the absolute difference between each consecutive pair of points</li>
  <li>Calculate the <strong>average moving range</strong> (mR̄)</li>
  <li>Upper Control Limit (UCL) = mean + 2.66 × mR̄</li>
  <li>Lower Control Limit (LCL) = mean − 2.66 × mR̄</li>
</ol>
<p>The constant 2.66 is derived from 3 / d₂ where d₂ = 1.128 for a sample size of 2. This is the MDC-recommended approach.</p>

<h2>Interpreting an XmR chart</h2>
<p>A process is said to be in <strong>statistical control</strong> when all points fall between the control limits and no non-random patterns are present. When a special cause signal appears, investigate what changed at that time — don't react to points within the limits as if they were meaningful.</p>
    `,
  },
  {
    slug: 'run-charts',
    title: 'Run Charts — Spotting Trends Without Limits',
    description:
      'Run charts plot data over time with a median line. Learn the four run chart rules for detecting non-random patterns.',
    body: `
<p>A run chart is the simplest form of SPC chart. It plots data points in time order with a <strong>median line</strong> rather than mean-based control limits. Run charts are useful early in an improvement project when you have fewer than 12–15 data points, or when you want a straightforward visual without the full XmR calculation.</p>

<h2>What a run chart tells you</h2>
<p>A run chart tests whether your data shows non-random patterns around the median. Four rules are applied to detect meaningful signals:</p>
<ul>
  <li><strong>Shift</strong> — 6 or more consecutive points all above or all below the median</li>
  <li><strong>Trend</strong> — 5 or more consecutive points all going up or all going down</li>
  <li><strong>Astronomical point</strong> — an unusually large or small value (judgement-based)</li>
</ul>
<p>(Note: run charts do not use the "within limits" Rule 1 from XmR charts because there are no control limits.)</p>

<h2>Switching to XmR</h2>
<p>Once you have 12–15 data points, consider switching to an XmR chart for more precise signal detection. You can change the chart type at any time in this tool using the <em>Chart</em> dropdown at the top of the chart.</p>
    `,
  },
  {
    slug: 'p-c-u-charts',
    title: 'Attribute Charts — P, C and U',
    description:
      'P charts for proportions, C charts for rare-event counts, and U charts for rates — when to use each and how they differ from XmR.',
    body: `
<p>When your data is a <strong>proportion</strong>, <strong>count</strong>, or <strong>rate</strong> rather than a continuous measurement, attribute control charts are the appropriate choice. The three main types are P, C, and U charts.</p>

<h2>P chart — proportions</h2>
<p>Use a P chart when your metric is a proportion: numerator events divided by a denominator (e.g. percentage of patients waiting more than 18 weeks). Each data point needs both a numerator and a denominator. P chart limits use the binomial distribution and vary with the denominator — wider limits when fewer patients are observed.</p>

<h2>C chart — counts of rare events (constant exposure)</h2>
<p>Use a C chart to count rare events when the exposure (denominator) is constant across all time periods — for example, the number of falls per month in a ward with a fixed number of beds. C chart limits use the Poisson distribution: UCL = mean + 3√mean, LCL = mean − 3√mean.</p>

<h2>U chart — rates (varying exposure)</h2>
<p>Use a U chart for counts of rare events when the exposure varies — for example, pressure ulcers per 1,000 patient bed-days where bed occupancy fluctuates. Like P charts, U chart limits vary by row depending on the denominator entered for each time period.</p>

<h2>Choosing the right chart</h2>
<table>
  <tr><th>Data type</th><th>Chart</th></tr>
  <tr><td>Continuous measurements</td><td>XmR or Run</td></tr>
  <tr><td>Proportions (events / total)</td><td>P chart</td></tr>
  <tr><td>Counts, fixed exposure</td><td>C chart</td></tr>
  <tr><td>Rates (counts / varying exposure)</td><td>U chart</td></tr>
</table>
    `,
  },
  {
    slug: 'four-rules-variation',
    title: 'The Four Rules of Variation (NHS MDC)',
    description:
      "NHS Making Data Count's four rules for detecting special cause variation in SPC charts, with examples.",
    body: `
<p>NHS England's Making Data Count programme defines four rules for detecting special cause variation in SPC charts. These rules are applied automatically in this tool — special cause data points are highlighted on the chart.</p>

<h2>Rule 1 — Point outside the limits</h2>
<p>A single data point that falls above the Upper Control Limit (UCL) or below the Lower Control Limit (LCL). This is the strongest signal: statistically, fewer than 0.3% of points from a stable process should fall outside the limits by chance.</p>

<h2>Rule 2 — Shift (run of 8+)</h2>
<p>Eight or more consecutive data points all on the same side of the mean (centre line). This indicates a sustained shift in the process level. A shift of 8 has less than a 0.4% probability of occurring by chance in a stable process.</p>

<h2>Rule 3 — Trend (6+ in a row)</h2>
<p>Six or more consecutive data points all going up or all going down (no reversals). This indicates a trend rather than random variation. Note: ties (identical consecutive values) are excluded from the count.</p>

<h2>Rule 4 — Too many or too few runs</h2>
<p>An unusual number of <em>runs</em> (sequences of consecutive points on the same side of the mean) compared with what a stable process would produce. This rule detects systematic oscillation (too few long runs) or unusual clustering near the centre line.</p>

<h2>Using the rules wisely</h2>
<p>Special cause signals should prompt investigation, not automatic action. Ask: <em>What changed at this time?</em> Consider whether an external event, a process change, or a data quality issue could explain the signal. The goal of SPC is learning, not just flagging.</p>
    `,
  },
  {
    slug: 'interpreting-signals',
    title: 'How to Interpret SPC Signals',
    description:
      'A practical guide to reading your SPC chart — what to do when a special cause signal appears.',
    body: `
<p>Seeing a special cause signal on your SPC chart is the start of an investigation, not the end. This guide walks through how to interpret what you see and decide what to do next.</p>

<h2>Step 1 — Identify the type of signal</h2>
<p>Look at which rule has been triggered and when. A single point beyond the limits often corresponds to a one-off event. A shift (8+ points on one side) suggests a sustained change to the process. A trend (6+ in a row) suggests something is gradually improving or deteriorating.</p>

<h2>Step 2 — Check the data</h2>
<p>Before investigating the process, verify the data. Unusual signals can be caused by data entry errors, coding changes, denominator changes, or system outages. If the signal is a data artefact, correct the data and re-examine the chart.</p>

<h2>Step 3 — Investigate the process</h2>
<p>If the data is correct, look for a process explanation:</p>
<ul>
  <li>Was there a change in staffing, equipment, or policy around the time the signal appeared?</li>
  <li>Was a quality improvement intervention implemented?</li>
  <li>Did an external factor (seasonal variation, system change) affect the metric?</li>
</ul>

<h2>Step 4 — Decide whether to recalculate limits</h2>
<p>If you have identified a genuine process change — and especially if you want to monitor the new process level going forward — you can mark a recalculation point in the chart. This resets the centre line and control limits from that point using only the data after the change.</p>

<h2>Step 5 — Document your learning</h2>
<p>Use the annotation feature to add a note to the data point where the signal occurred. Recording what happened and why creates an audit trail and institutional memory.</p>
    `,
  },
  {
    slug: 'common-vs-special-cause',
    title: 'Common Cause vs Special Cause Variation',
    description:
      'Understanding the difference between routine process variation and signals that something has genuinely changed.',
    body: `
<p>The most important distinction in SPC is between two fundamentally different types of variation. Getting this right determines whether your response to data is helpful or harmful.</p>

<h2>Common cause variation</h2>
<p>Common cause variation (also called <em>random</em> or <em>noise</em>) is the inherent, expected variation in any process. It is produced by the many small, everyday factors that influence a system — the combined effect of dozens of inputs, each varying slightly.</p>
<p>A process showing only common cause variation is said to be <strong>in statistical control</strong> or <strong>stable</strong>. This does not mean it is good — it may be stably performing at an unacceptable level — but it does mean it is <em>predictable</em>.</p>
<p><strong>The right response to common cause variation:</strong> Change the system. Small tweaks to individual steps will not improve a stable process. Fundamental redesign — changing the inputs, redesigning the pathway, or improving training — is needed to shift the mean.</p>

<h2>Special cause variation</h2>
<p>Special cause variation (also called <em>assignable cause</em> or <em>signal</em>) indicates that something specific happened at a particular point in time. It is not explained by the normal process inputs. Special cause signals appear as points outside the control limits, shifts, trends, or unusual patterns.</p>
<p><strong>The right response to special cause variation:</strong> Investigate and identify what changed. If the change was harmful (e.g. a data quality failure), fix it. If the change was beneficial (e.g. an improvement intervention worked), understand why and spread it.</p>

<h2>Why the distinction matters</h2>
<p>W. Edwards Deming identified "tampering" — reacting to common cause variation as if it were a special cause — as one of the most damaging management behaviours. Tampering increases variation rather than reducing it. SPC charts give you a principled way to decide when to act and when to leave a process alone.</p>
    `,
  },
  {
    slug: 'spc-in-healthcare',
    title: 'SPC in Healthcare and the NHS',
    description:
      'How Statistical Process Control is used in NHS improvement programmes and why it is the recommended approach for NHS performance reporting.',
    body: `
<p>Statistical Process Control has been used in healthcare quality improvement since the 1980s, but its adoption in the NHS accelerated significantly following the publication of NHS England's <em>Making Data Count</em> (MDC) programme guidance.</p>

<h2>Making Data Count</h2>
<p>Making Data Count is an NHS England programme that promotes the use of SPC as the standard method for displaying and interpreting NHS performance data. The programme argues that traditional approaches — traffic light RAG ratings, comparisons to targets, year-on-year percentages — conceal variation and lead to poor decisions.</p>
<p>MDC guidance recommends:</p>
<ul>
  <li>Displaying data as a time series rather than a single number</li>
  <li>Using XmR control charts with the four rules of variation</li>
  <li>Avoiding arbitrary RAG thresholds that trigger management reactions to common cause noise</li>
  <li>Using variation icons consistently to communicate findings</li>
</ul>

<h2>Common NHS applications</h2>
<p>SPC is routinely used across the NHS for:</p>
<ul>
  <li>A&amp;E 4-hour performance monitoring</li>
  <li>Elective waiting list management</li>
  <li>Patient safety metrics (falls, pressure ulcers, hospital-acquired infections)</li>
  <li>Cancer waiting time standards</li>
  <li>Mortality indicators (HSMR, SHMI)</li>
  <li>Quality improvement project measurement</li>
</ul>

<h2>SPC and improvement science</h2>
<p>SPC integrates naturally with the <strong>Model for Improvement</strong> (IHI), which is the most widely used improvement framework in the NHS. SPC charts are the measurement component of PDSA (Plan-Do-Study-Act) cycles — they make it visible whether a change is leading to improvement.</p>

<h2>Further reading</h2>
<ul>
  <li>NHS England Making Data Count: <a href="https://www.england.nhs.uk/publication/making-data-count/" target="_blank" rel="noopener">england.nhs.uk</a></li>
  <li>Institute for Healthcare Improvement (IHI): <a href="https://www.ihi.org" target="_blank" rel="noopener">ihi.org</a></li>
</ul>
    `,
  },
];

export function getArticle(slug: string): GuideArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

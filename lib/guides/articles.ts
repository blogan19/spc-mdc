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
      'SPC explained for NHS and healthcare teams — what it is, why it beats RAG ratings, and how it follows NHS Making Data Count guidance.',
    body: `
<p>Statistical Process Control (SPC) is a method for monitoring, controlling, and improving a process over time by tracking variation in your data. Originally developed by Walter Shewhart at Bell Labs in the 1920s and refined by W. Edwards Deming, SPC was adopted widely in manufacturing quality improvement and later became a cornerstone of healthcare quality improvement worldwide.</p>
<p>In the NHS, SPC is the recommended approach for displaying and interpreting performance data, promoted through NHS England's <strong>Making Data Count</strong> (MDC) programme.</p>

<h2>Why SPC matters in healthcare</h2>
<p>Every process has variation. The critical question is: <strong>is this variation normal (expected) or is something different happening?</strong> Traditional approaches — RAG ratings, month-on-month comparisons, year-on-year percentages, single-point targets — hide the story in your data and can lead to poor decisions. SPC charts display your data over time and use statistical limits to help you distinguish between the two types of variation:</p>
<ul>
  <li><strong>Common cause variation</strong> — random, inherent to the process, predictable within limits. No special action is needed; redesigning the system is the only way to shift the mean.</li>
  <li><strong>Special cause variation</strong> — a signal that something has genuinely changed. Investigate what happened at that specific point in time.</li>
</ul>

<h2>How an SPC chart works</h2>
<p>An SPC chart plots each data point in time order. It calculates a <strong>centre line</strong> (mean or median) and <strong>control limits</strong> — upper and lower bounds that represent the expected range of variation for a stable process. Points outside the limits, or unusual patterns within them, indicate special cause variation requiring investigation.</p>
<p>The most common chart type for NHS continuous metrics is the <strong>XmR chart</strong> (Individuals and Moving Range), which calculates limits using the average moving range method. For proportions and count data, attribute charts (P, C, U) are used instead.</p>

<h2>SPC in the NHS — Making Data Count</h2>
<p>NHS England's <em>Making Data Count</em> programme has adopted SPC as the standard approach to displaying NHS performance data. The programme defines <strong>four rules for detecting special cause variation</strong> and a consistent set of variation icons for communicating findings to boards and improvement teams.</p>
<p>This tool follows the MDC methodology, including the four variation rules, the XmR control chart recipe (mean ± 3-sigma limits using the average moving range), and the MDC variation and assurance icons.</p>
<p>See also: <a href="/guides/xmr-charts">XmR charts</a>, <a href="/guides/four-rules-variation">the four rules of variation</a>, <a href="/guides/spc-in-healthcare">SPC in the NHS</a>.</p>
    `,
  },
  {
    slug: 'xmr-charts',
    title: 'XmR Charts — Individuals and Moving Range',
    description:
      'How XmR control charts work for NHS metrics — calculating UCL and LCL using the average moving range, and when to use them over run or attribute charts.',
    body: `
<p>The XmR chart — also called the Individuals and Moving Range chart — is the most commonly used SPC chart for continuous data. It is the default chart type in this tool and is recommended by NHS England's Making Data Count programme for most healthcare metrics where you have a single measurement per time period.</p>

<h2>When to use an XmR chart</h2>
<p>Use an XmR chart when:</p>
<ul>
  <li>You have a single continuous measurement per time period (e.g. monthly A&amp;E 4-hour performance, average length of stay, total referrals)</li>
  <li>Your data is not a proportion or count of rare events (use <a href="/guides/p-c-u-charts">P, C or U charts</a> for those)</li>
  <li>You have at least 12–15 data points — with fewer, consider a <a href="/guides/run-charts">run chart</a> first</li>
</ul>
<p>XmR charts are robust and work well even when data are not normally distributed, making them the practical choice for most NHS performance metrics.</p>

<h2>How the limits are calculated</h2>
<p>XmR limits use the <strong>average moving range</strong> method — the MDC-recommended approach:</p>
<ol>
  <li>Calculate the <strong>mean</strong> of all data points</li>
  <li>Calculate the <strong>moving range</strong> — the absolute difference between each consecutive pair of points (|x₂−x₁|, |x₃−x₂|, …)</li>
  <li>Calculate the <strong>average moving range</strong> (mR̄)</li>
  <li>Upper Control Limit (UCL) = mean + 2.66 × mR̄</li>
  <li>Lower Control Limit (LCL) = mean − 2.66 × mR̄ (floored at zero where appropriate)</li>
</ol>
<p>The constant 2.66 is derived from 3 / d₂ where d₂ = 1.128 for a sample size of 2. This gives limits equivalent to ±3 standard deviations for a stable process.</p>

<h2>Interpreting an XmR chart</h2>
<p>A process is said to be in <strong>statistical control</strong> when all points fall between the control limits and no non-random patterns are present. When a special cause signal appears, investigate what changed at that time using the <a href="/guides/four-rules-variation">four rules of variation</a>. Never react to points within the limits as if they were meaningful — this is what NHS MDC calls "noise".</p>
<p>If a genuine, sustained process change has occurred (for example, a quality improvement intervention has worked), you can <strong>recalculate the control limits</strong> from that point to reflect the new process level.</p>
<p>See also: <a href="/guides/interpreting-signals">how to interpret SPC signals</a>, <a href="/guides/common-vs-special-cause">common cause vs special cause variation</a>.</p>
    `,
  },
  {
    slug: 'run-charts',
    title: 'Run Charts — Spotting Trends Without Limits',
    description:
      'Run charts for NHS improvement — plotting data over time with a median line, the run chart rules for detecting non-random patterns, and when to switch to XmR.',
    body: `
<p>A run chart is the simplest form of SPC chart. It plots data points in time order with a <strong>median line</strong> rather than mean-based control limits. Run charts are a good starting point in an improvement project when you have fewer than 12–15 data points, or when you want a clear visual without a full XmR calculation.</p>

<h2>What a run chart tells you</h2>
<p>A run chart tests whether your data shows non-random patterns around the median. Because there are no control limits, it uses probability-based rules to detect meaningful signals. Three rules are applied:</p>
<ul>
  <li><strong>Shift</strong> — 6 or more consecutive points all above or all below the median (fewer than a 2% probability by chance)</li>
  <li><strong>Trend</strong> — 5 or more consecutive points all going up or all going down, with no reversals (ties excluded)</li>
  <li><strong>Astronomical point</strong> — an unusually large or small value that stands out clearly from the rest (judgement-based, not statistical)</li>
</ul>
<p>Note: run charts do not apply Rule 1 (points outside limits) because there are no control limits. For the full set of <a href="/guides/four-rules-variation">four NHS MDC variation rules</a>, switch to an XmR chart.</p>

<h2>When to use a run chart vs XmR</h2>
<p>Run charts are appropriate when you have fewer than 12 data points and want to visualise a trend without waiting to calculate stable limits. They are also useful when introducing SPC to a team for the first time, as the median line is easier to explain than mean-based control limits.</p>
<p>Once you have 12–15 data points, switch to an <a href="/guides/xmr-charts">XmR chart</a> for more precise signal detection. You can change the chart type at any time in this tool using the <em>Chart</em> dropdown.</p>
    `,
  },
  {
    slug: 'p-c-u-charts',
    title: 'Attribute Charts — P, C and U',
    description:
      'P charts for proportions, C charts for rare-event counts, and U charts for rates — choosing the right attribute control chart for NHS performance and safety data.',
    body: `
<p>When your data is a <strong>proportion</strong>, <strong>count</strong>, or <strong>rate</strong> rather than a continuous measurement, attribute control charts are the appropriate choice. The three main types — P, C, and U — are all available in this tool and follow the NHS Making Data Count methodology.</p>

<h2>P chart — proportions</h2>
<p>Use a P chart when your metric is a proportion: numerator events divided by a denominator population. Common NHS examples include percentage of patients waiting more than 18 weeks, infection rates per admission, and staff vaccination uptake rates. Each data point needs both a numerator and a denominator entered in the data table.</p>
<p>P chart limits use the <strong>binomial distribution</strong> and vary with the denominator — limits are wider when fewer patients are observed, narrowing as the denominator grows. This correctly accounts for the statistical uncertainty in smaller samples.</p>

<h2>C chart — counts of rare events (constant exposure)</h2>
<p>Use a C chart to count rare events when the <strong>exposure (denominator) is constant</strong> across all time periods — for example, the number of falls per month in a ward with a fixed number of beds, or medication errors per month in a department of consistent size. C chart limits use the Poisson distribution: UCL = mean + 3√mean, LCL = mean − 3√mean.</p>

<h2>U chart — rates (varying exposure)</h2>
<p>Use a U chart for counts of rare events when the exposure varies — for example, pressure ulcers per 1,000 patient bed-days where bed occupancy fluctuates month to month, or falls per 100 occupied bed-days. The denominator (exposure) must be entered for each time period. Like P charts, U chart limits vary by row.</p>

<h2>Choosing the right chart</h2>
<table>
  <tr><th>Data type</th><th>NHS example</th><th>Chart</th></tr>
  <tr><td>Continuous measurements</td><td>Average length of stay</td><td><a href="/guides/xmr-charts">XmR</a> or <a href="/guides/run-charts">Run</a></td></tr>
  <tr><td>Proportions (events / total)</td><td>18-week RTT performance %</td><td>P chart</td></tr>
  <tr><td>Counts, fixed exposure</td><td>Falls per month (fixed beds)</td><td>C chart</td></tr>
  <tr><td>Rates (counts / varying exposure)</td><td>Pressure ulcers per 1,000 bed-days</td><td>U chart</td></tr>
</table>
    `,
  },
  {
    slug: 'four-rules-variation',
    title: 'The Four Rules of Variation (NHS MDC)',
    description:
      'The four NHS Making Data Count rules for detecting special cause variation — points outside limits, shifts of 8+, trends of 6+, and too few runs — with examples.',
    body: `
<p>NHS England's Making Data Count programme defines four rules for detecting special cause variation in SPC charts. These rules are applied automatically in this tool — data points that trigger a rule are highlighted on the chart, and the variation badge updates to reflect the current signal status.</p>
<p>All four rules work together: a single chart can trigger more than one rule simultaneously. Each rule detects a different type of non-random pattern.</p>

<h2>Rule 1 — Point outside the limits</h2>
<p>A single data point that falls above the Upper Control Limit (UCL) or below the Lower Control Limit (LCL). This is the strongest and most immediate signal: statistically, fewer than 0.3% of points from a stable process should fall outside the limits by chance. An out-of-limits point almost always represents a genuine change or a data quality issue worth investigating.</p>

<h2>Rule 2 — Shift (run of 8 or more)</h2>
<p>Eight or more consecutive data points all on the same side of the mean (centre line), regardless of whether they trigger any other rule. This indicates a <strong>sustained shift in the process level</strong>. A shift of 8 has less than a 0.4% probability of occurring by chance in a stable process. In NHS practice, a shift often corresponds to a policy change, staff change, or the embedding of an improvement intervention.</p>

<h2>Rule 3 — Trend (6 or more in a row)</h2>
<p>Six or more consecutive data points all going up or all going down, with no reversals (ties excluded from the count). This indicates a <strong>progressive trend</strong> rather than random variation — something is consistently pushing the process in one direction. A trend of 6 has approximately a 1.6% probability of occurring by chance.</p>

<h2>Rule 4 — Too many or too few runs</h2>
<p>An unusual number of <em>runs</em> (sequences of consecutive points on the same side of the mean) compared with what a stable process would produce. Too few runs indicates systematic oscillation or clustering — the process may be artificially balanced or data may be smoothed. Too many runs indicates unusual instability or alternating patterns.</p>

<h2>Using the rules wisely</h2>
<p>Special cause signals should prompt investigation, not automatic action. Ask: <em>What changed at this time?</em> Consider whether an external event, a process change, or a data quality issue could explain the signal. The goal of SPC is learning and improvement, not just flagging numbers.</p>
<p>See also: <a href="/guides/interpreting-signals">how to interpret SPC signals</a>, <a href="/guides/common-vs-special-cause">common cause vs special cause variation</a>.</p>
    `,
  },
  {
    slug: 'interpreting-signals',
    title: 'How to Interpret SPC Signals',
    description:
      'A practical guide to reading NHS SPC charts — what to do when a special cause signal appears, how to check data quality, and when to recalculate control limits.',
    body: `
<p>Seeing a special cause signal on your SPC chart is the start of an investigation, not the end. This guide walks through a practical five-step process for interpreting what you see and deciding what to do next — following NHS Making Data Count principles.</p>

<h2>Step 1 — Identify the type of signal</h2>
<p>Look at which of the <a href="/guides/four-rules-variation">four rules</a> has been triggered and when. A single point beyond the limits often corresponds to a one-off event. A shift (8+ points on one side of the mean) suggests a sustained change to the process level. A trend (6+ in a row) suggests something is gradually improving or deteriorating over time.</p>

<h2>Step 2 — Check the data</h2>
<p>Before investigating the process, verify the data. Unusual signals can be caused by:</p>
<ul>
  <li>Data entry errors or transcription mistakes</li>
  <li>Coding changes or definition changes (a new ICD-10 code, a changed numerator definition)</li>
  <li>Denominator changes (a ward merged, the catchment population changed)</li>
  <li>System outages or reporting delays affecting completeness</li>
</ul>
<p>If the signal is a data artefact, correct the data and re-examine the chart. Do not recalculate limits to hide a genuine process change.</p>

<h2>Step 3 — Investigate the process</h2>
<p>If the data is correct, look for a process explanation:</p>
<ul>
  <li>Was there a change in staffing, equipment, policy, or pathway around the time the signal appeared?</li>
  <li>Was a quality improvement intervention or PDSA cycle implemented?</li>
  <li>Did an external factor (seasonal variation, system change, pandemic) affect the metric?</li>
  <li>Did a comparable organisation or ward show the same pattern at the same time?</li>
</ul>

<h2>Step 4 — Decide whether to recalculate limits</h2>
<p>If you have identified a genuine, sustained process change — and especially if you want to monitor the new process level going forward — you can mark a <strong>recalculation point</strong> in the chart. This resets the centre line and control limits from that point using only the data after the change. Use this deliberately: recalculating too frequently can hide signals.</p>

<h2>Step 5 — Document your learning</h2>
<p>Use the annotation feature to add a note to the data point where the signal occurred. Recording what happened and why creates an audit trail and institutional memory — essential for NHS improvement programmes and board reporting.</p>
<p>See also: <a href="/guides/common-vs-special-cause">common cause vs special cause variation</a>, <a href="/guides/four-rules-variation">the four rules of variation</a>.</p>
    `,
  },
  {
    slug: 'common-vs-special-cause',
    title: 'Common Cause vs Special Cause Variation',
    description:
      "Common cause versus special cause variation in NHS SPC — what the difference is, why Deming's tampering harms performance, and the right response to each type.",
    body: `
<p>The most important distinction in Statistical Process Control is between two fundamentally different types of variation. Getting this right determines whether your response to data is helpful or harmful — and it is central to NHS Making Data Count's case for moving beyond RAG ratings and single-point comparisons.</p>

<h2>Common cause variation</h2>
<p>Common cause variation (also called <em>random variation</em>, <em>noise</em>, or <em>chance cause</em>) is the inherent, expected variation in any process. It is produced by the many small, everyday factors that influence a system — the combined effect of dozens of inputs, each varying slightly.</p>
<p>A process showing only common cause variation is said to be <strong>in statistical control</strong> or <strong>stable</strong>. This does not mean it is performing well — it may be stably performing at an unacceptable level — but it does mean it is <em>predictable</em>, and its future performance can be forecast within the control limits.</p>
<p><strong>The right response to common cause variation:</strong> Change the system. Reacting to individual data points within the limits — adjusting, intervening, asking for explanations — will not improve the process and typically makes it worse. Fundamental redesign of the pathway, inputs, or approach is needed to shift the mean.</p>

<h2>Special cause variation</h2>
<p>Special cause variation (also called <em>assignable cause</em> or <em>signal</em>) indicates that something specific happened at a particular point in time. It is not explained by the normal, everyday inputs of the process. Special cause signals appear as points outside the control limits, shifts, trends, or unusual patterns as defined by the <a href="/guides/four-rules-variation">four NHS MDC rules</a>.</p>
<p><strong>The right response to special cause variation:</strong> Investigate and identify what changed. If the change was harmful (a data quality failure, a staffing crisis, a system breakdown), fix it and prevent recurrence. If the change was beneficial (an improvement intervention worked, a new pathway embedded), understand why it worked and spread it.</p>

<h2>Why the distinction matters — Deming's tampering</h2>
<p>W. Edwards Deming identified <strong>"tampering"</strong> — reacting to common cause variation as if it were a special cause — as one of the most damaging management behaviours in organisations. Tampering increases variation rather than reducing it, because each reactive adjustment introduces a new source of noise into the system.</p>
<p>Examples of tampering in NHS settings include: asking a ward to explain why performance was 1% lower this month than last month; adjusting a process whenever a metric moves in the wrong direction without a signal; setting alerts on month-on-month changes rather than on statistical signals.</p>
<p>SPC charts give you a principled, statistically grounded way to decide when to act and when to leave a process alone.</p>
<p>See also: <a href="/guides/what-is-spc">what is SPC</a>, <a href="/guides/interpreting-signals">how to interpret SPC signals</a>.</p>
    `,
  },
  {
    slug: 'spc-in-healthcare',
    title: 'SPC in Healthcare and the NHS',
    description:
      'How SPC is used across the NHS — Making Data Count, A&E performance, waiting lists, patient safety metrics, and integration with PDSA improvement cycles.',
    body: `
<p>Statistical Process Control has been used in healthcare quality improvement since the 1980s, but its adoption in the NHS accelerated significantly following the publication of NHS England's <em>Making Data Count</em> (MDC) programme guidance. SPC is now the NHS-recommended method for displaying and interpreting performance data at every level — from ward to board.</p>

<h2>Making Data Count</h2>
<p>Making Data Count is an NHS England programme that promotes SPC as the standard method for performance reporting and improvement measurement. The programme argues that traditional approaches — traffic light RAG ratings, comparisons to a fixed target, year-on-year percentage changes — conceal variation, trigger inappropriate reactions, and lead to poor decisions.</p>
<p>MDC guidance recommends:</p>
<ul>
  <li>Displaying data as a <strong>time series</strong> rather than a single aggregate number</li>
  <li>Using <strong>XmR control charts</strong> with the four rules of variation for most continuous NHS metrics</li>
  <li>Avoiding arbitrary RAG thresholds that trigger management reactions to common cause noise</li>
  <li>Using <strong>variation icons</strong> consistently to communicate findings to boards and committees</li>
  <li>Moving towards <strong>annotated, narrative-driven charts</strong> that tell the story of a metric over time</li>
</ul>

<h2>Common NHS applications</h2>
<p>SPC is routinely used across NHS trusts, ICBs, and national bodies for:</p>
<ul>
  <li><strong>Emergency care:</strong> A&amp;E 4-hour performance, ambulance response times, ED attendance rates</li>
  <li><strong>Elective care:</strong> Referral to Treatment (RTT) waiting list size and waiting times, cancer waiting time standards</li>
  <li><strong>Patient safety:</strong> Falls rates, pressure ulcer incidence, hospital-acquired infection rates, medication errors, never events</li>
  <li><strong>Mortality:</strong> Hospital Standardised Mortality Ratio (HSMR), Summary Hospital-level Mortality Indicator (SHMI)</li>
  <li><strong>Workforce:</strong> Staff sickness absence rates, vacancy rates, bank and agency spend</li>
  <li><strong>Quality improvement:</strong> Measuring the impact of PDSA cycles and improvement programmes</li>
</ul>

<h2>SPC and improvement science</h2>
<p>SPC integrates naturally with the <strong>Model for Improvement</strong> (IHI), which is the most widely used improvement framework in the NHS. SPC charts provide the <em>measurement</em> component of PDSA (Plan-Do-Study-Act) cycles — they make it statistically visible whether a change is leading to genuine improvement or whether the variation observed is within the range of common cause noise.</p>
<p>Without SPC, improvement teams risk celebrating common cause fluctuations as evidence that an intervention worked, or abandoning effective interventions because of a temporary dip in performance. With SPC, the signal is clear.</p>

<h2>Further reading</h2>
<ul>
  <li>NHS England Making Data Count: <a href="https://www.england.nhs.uk/publication/making-data-count/" target="_blank" rel="noopener">england.nhs.uk</a></li>
  <li>Institute for Healthcare Improvement (IHI) — Model for Improvement: <a href="https://www.ihi.org" target="_blank" rel="noopener">ihi.org</a></li>
</ul>
<p>See also: <a href="/guides/what-is-spc">what is SPC</a>, <a href="/guides/xmr-charts">XmR charts</a>, <a href="/guides/four-rules-variation">the four variation rules</a>.</p>
    `,
  },
];

export function getArticle(slug: string): GuideArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

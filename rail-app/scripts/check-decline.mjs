import { ALL_RESULTS } from "../lib/engine";
const rs = ALL_RESULTS();
for (const r of rs) console.log(r.profileId, r.decision, r.score.toFixed(1), r.grade, r.limitKrw, r.apr, r.flags.map(f=>f.code).join(","));

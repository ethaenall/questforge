# What not to claim

Hard stop for README, Devpost, walkthroughs, demo scripts, and agent copy.
If a sentence is not true on disk right now, do not write it.

Source of status: [SUBMISSION.md](./SUBMISSION.md). Unfinished items stay **PENDING**.

## Never claim

| Do not say | What is true |
| ---------- | ------------ |
| There is a hosted / live / public demo URL | **No deployment exists.** Hosted URL is **PENDING** — operator deploy decision only. Do not invent a Pages, Vercel, or other public URL. |
| There is a demo video | **Not recorded.** Demo video is **PENDING**. Do not link, embed, or imply a walkthrough tape. |
| ModelKernel is required | **It is not.** LocalKernel is the default diagnostic engine. The judge path needs no login, no API key, and no model. ModelKernel is an optional BYO OpenAI-compatible endpoint; if it is unset or fails, LocalKernel still runs. |

## Say instead

- **Demo:** run locally (`npm run dev`, or `npm run preview` at `http://127.0.0.1:4173`). No hosted URL until the operator deploys one and updates SUBMISSION.md.
- **Video:** omit. Point at [JUDGE_WALKTHROUGH.md](./JUDGE_WALKTHROUGH.md) or [DEMO_SCRIPT.md](./DEMO_SCRIPT.md).
- **Kernel:** “LocalKernel by default (offline, authored signatures). ModelKernel is optional.” Never “requires AI,” “needs a model,” or “won’t diagnose without a key.”

## Also do not imply

- That the judge must configure Model engine settings.
- That a 501 / missing key is a broken demo. Unconfigured ModelKernel is the expected path.
- That `JUDGE_WALKTHROUGH.md`’s “hosted demo, or locally” line means a public URL exists. It does not. Local preview only until deploy is real.

Do not mark Hosted URL or Demo video **DONE** in this repo unless the artifact actually exists.

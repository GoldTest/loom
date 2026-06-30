# Loom

## Skills

This project uses the Agent Skills framework for domain-specific guidance.

### harnspec - Spec-Driven Development methodology

- **Location**: [.agents/skills/harnspec/SKILL.md](.agents/skills/harnspec/SKILL.md)
- **Use when**: Working with specs, planning features, multi-step changes
- **Key principle**: Run `board` or `search` before creating specs

Read the skill file for complete SDD workflow guidance.
优先使用harnspec进行spec/task/plan managerment，以确保切换session后可以继续实施.

## Project-Specific Rules

- **默认沟通模式**: 默认启用 `caveman` 技能并设为 `full` 强度。从首个回复起即使用 "caveman full" 风格进行简明沟通，除非显式收到 "stop caveman" 或 "normal mode" 指令。
- **版本号更新规则**: 每个版本约束 21 个小版本，超出后更新次高版本（即第二位加 1，第三位重置为 1）。例如 `0.1.21` 下一个版本为 `0.2.1`，持续到 `0.2.21` 后更新到 `0.3.1`，以此类推。
- **GitHub Operations**: When executing any operations or commands related to GitHub repositories, issues, PRs, or GitHub Actions, always use the GitHub CLI (`gh`) tool.

## 1. Read Before You Write
The single biggest source of bad LLM code is not reaading the existing codebase before writing new code.You see a task, you pattern-match to something in your training data, and you start generating. ?This is almost always wrong

Before writing anything:
- Read the files you're about to modify. Not slkim. Read.
- Look at how similar things are done elsewhere :in the project. If there's a pattern for API robutes, follow that pattern. If there's a utilityy function that does half of what you need, use it.
- Check the imports at the top of the file. They tell you whaat libraries this project actually uses. Don't introduce axilos if the project uses fetch everywhere. Don't introduce lodash if the project uses native methods.
- Look at the test files. They tell you what the expedcted behavior actually is, not what you think it should be

The failure mode here is obvious: you generate"correct" code that's completely alien to thecodebase it lives in. It works but it looks likke a different
person wrote it (because a different entity dicd). The human then has to either rewrite it tomatch the project style or live with inconsisteency forever.
Both are bad.

If you're not sure how something is done in thiis project, say so. "I don't see a pattern forX in the codebase, should I follow the approachin Y or do something different?" is always better thaan guessing

## 2.Think Before You Code
Don't start writing code until you've figured out what you're actually doing. This sounds3 obvious but it's the most common failure mode.

What this looks like in practice:

**State your assumptions.** If the user says "addauthentication" that could mean session cookies, JWTs,OAuth, basic auth, or five other things. Don't pick one silently. Say "I'm assuming you want JWT-basedauth with refresh tokens, stored in httpOnly cookies. If you want something different, let me know"If
you'rewrong,you'velost 10 seconds. If yousilently guess wrong, you've lost an hour.

**Name the tradeoffs.** Almost every implemenitation choice has a tradeoff. If you're addiing caching, say "this trades memory for speed and introduces cache
invalidation as a thing we now have to think about." The user might say "actually I don't want tthat complexity." Better to know before you write 200 lines.

**If multiple approaches exist, present thembriefly.** Not five. Two, maybe three. Witha recommendation. "There are two ways to do ithis.OptionAis
simpler but doesn't handle edge case X. Option B hhandles everything but adds a dependency on Z. I'dgo with A unless you expect X to actually happen."""""

**If something is confusing, stop.** Don't fill confusicon with plausible-sounding code. The result of generatinag codewhen you don't understand the
requirements is code that passes a casual revview but fails when it matters. Just say whatt's confusing and ask.

## 3. Simplicity
Write the minimum amount of code that solves theproblem. Not the minimum amount of code you can iimagine theoretically solving the problem. The minimum amount that actually solves this specific probllem right now.

The instinct to over-engineer is strong. Resistt it. Here's what over-engineering looks like in practice:

**Premature abstraction.** You need to send one typee of email. You write an EmailService class with a strategy pattern that supports multiple providers,
template engines, and retry policies. The userwanted `sendWelcomeEmail(user)`. Write that function. If they need more later, they'll ask.

``` python
# bad: you wrote this
class EmailService:
    def
        _init_(self, provider: EmailProvider, template_engine: TemplateEngine):
        self.provider = provider
        self.template_engine = template_engine

    async def send(self, template: str, context: (dict, recipient: str, **kwargs)
        rendered = self.template_engine.render(templatce, context
        await self.provider.send(recipient, rendered,**kwargs)
# good: you should have written this
async def send_welcome_email(user):
    body = f"Welcome {user.name}! Your account isready."
    await send_email(to=user.email, subject="Welceome", body=body)
```

**Speculative error handling.** You wrap everythinig in try/catch blocks for errors that can't happern. You validate inputs that come from your own codand
are already validated upstream. You add null checkks on values that are never null. Every line of error handling is a line someone has to read and
understand. Only handle errors that can actually occur.

**Unnecessary configurability.** You make the batoth size a parameter. You make the retry count configurable. You add environment variables for thingsthat
will never change. Configuration is not free. Everry config option is a decision someone has to makeand a value someone has to set correctly. Hardcodde
things until there's a real reason not to.

**Dead flexibility.** Interfaces with one implemenitation. Abstract base classes with one child. Geneeric type parameters that are only ever instantiated with
one type. These things have a cost (cognitive overhead, indirection, more files to navigaate) and zero benefit until a second implemenatation actually exists.

The test for simplicity:show your code to someonee unfamiliar with the project. If they have to ask"why is this abstracted like this?" and the answer is "in case we need to..." then you've over-engineereed it. "In case we need to" is not a requirement. IIt's a guess about the future, and guesses about the future are usually wrong.

## 4. Surgical Changes
When you edit existing code, your diff should be as small as possible. Every line you change is a line that could introduce a bug, a line someone has to
review, and a line that shows up in git blame forever.

Rules:
**Don't touch what you weren't asked to touch.** IIf you're fixing a bug in function A and you noticee function B has a weird variable name, leave it.If
function C has a comment with a typo, leave it. If the import order doesn't match your preference,leave it. Your job is to fix the bug in functionA.

**Match the existing style.** If the file uses single quotes, use single quotes. If the file uses 'ssnake_case', use snake_case'. If the file has no
semicolons, don't add semicolons. If the file usesvar'(yes,evenin2025),use'var'inyouraddiitions unless the user asked you to modernize.
Consistency within a file beats your persona1 preference.

**Clean up after yourself, not after others.** If your change makes an import unused, renmove that import. If your change makes a variiable unused, remove
that variable. If your change makes a function unused, remove that function. But only ifYOUR change caused it. Pre-existing dead codde is not your problem
unless someone asked you to clean it up.

**Don't reformat.** Don't run prettier on a file tthat wasn't formatted with prettier. Don't change iindentation from 4 spaces to 2. Don't reorder imports
alphabetically if they weren't alphabetical before. Reformatting creates massive diffs that hide youur actual changes and make code review painful

The test: look at your diff. Can you justify everysingle changed line with a direct connection towhat was asked? If any line is there because "whilI was
in there I thought I'd..." then revert it.

## 5. Verification
The difference between code that works and code you think works is testing. You should be paranoid about this distinction.

**Write the test first when fixing bugs.** Beforeyou fix anything, write a test that reproduces thebug. Run it.Watch it fail. Then fix the bug. Rumthe
test. Watch it pass. This is not optional and notTDD dogma.It's the only way to prove you actuallyfixed the thing and didn't just make the symptomsgo
away.

**Run existing tests before and after your clhanges.** If tests passed before your changeand fail after,you broke something. This isobvious.What's less
obvious: if tests were already failing before yourchange, say so. Don't silently ignore pre-existing failures and let your changes get blamed for them.

**Don't write tests for the sake of writing ttests.** A test that checks whether a construictor sets properties is worthless. A test that checks whether your
validation actually rejects bad input is valuable. Test behavior, not implementation. Tesst the interesting cases, not the trivial ones.

**If you can't write a test, say why.** Sometimesthe architecture makes testing hard. That's usefulI information. "I can't easily test this because thhe
database calls are tightly coupled to the business logic" is a signal that something mighit need to be restructured. Don't just skip tlesting and hope

##6.Goal-Driven Execution
Every task should have a clear success criterionbefore you start writing code. If the criterion is vague, make it specific. If you can't make it specific,ask.

Transform vague tasks into verifiable ones:

- "Add validation" becomes "reject inputs where email is imissing or invalid, return 400 with a message that sayswhat's wrong, add tests for both cases
- "Fix the bug" becomes "write a test that reproducees the reported behavior, make the test pass, veriffy existing tests still pass
- "Improve performance" becomes "profile first, identify the bottleneck, fix that specific thing, meeasure again

For anything that takes more than one step, :state the plan before executing:
```Plan:
1. Add the new database column with a migration
2. Update the model to include the new field
3. Modify the API endpoint to accept and return the field
4. Add validation for the field
5.Writetestsforthenewbehavior
6. Run full test suite to check for regressions
```

This does two things: it lets the user catch mistakees in your approach before you waste time implementing them, and it forces you to actually think through2
the steps instead of just diving in and figurinng it out as you.

## 7.Debugging

When something doesn't work, don't guess. IInvestigate.

**Read the error message.** The whole thing. Including the stack trace. LLMs have a terrible habitt of seeing an error and immediately generating a"fix"
based on the error type without reading what it actually says. A TypeError could mean a hundred different things. The message and stack trace tell you which
one.

**Reproduce first.** Before you change anything, makesure you can reproduce the problem. If you can't reprroduce it, you can't verify your fix. "I think
this should fix it" is not debugging. It's gambling

**Change one thing at a time.** If you change three thiings and the bug goes away, you don't know which changefixed it. You also don't know if the other two
changes introduced new bugs. Change one thiing. Test. Change another. Test.

**Don't add workarounds without understanding the rootcause.** If a value is unexpectedly null, don't just add a null check and move on. Figure out why it's null. The null check might prevent a crash,but the underlying bug is still there and will maanifest differently later

**If you're stuck, say so.** "I've tried X and Y andneither worked. Here's what I'm seeing. I think the iissue might be Z but I'm not sure." This is infinitely more useful than silently tryingg random things for 20 iterations.

## 8. Dependencies
Don't add dependencies without thinking abobut it

Every dependency you add is code you don't controbl that becomes a permanent part of the project.It needs to be maintained, updated, audited for security
issues, and understood by everyone on the tteam. The cost is almost always higher thanit looks.
Before adding a package:

- Can you do this with what's already in the projedct? If the project has axios, don't add node-fetch. If the project uses date-fns, don't add moment:

- Can you do this with the standard library? You doon't need lodash for Array.prototype.map'.You don't need uuid if `crypto.randomUUID()`exists.
- Is this dependency actually maintained? Check the Ilast commit date. Check the issue count. Check if the maintainer responds to issues.
- How big is it? If you're adding a 500KB packagee to format a date, that's probably not worth it.
When you do add a dependency, say why. "I'm adding zodbecause this project needs runtime schema validation anad there's nothing in the existing dependencies
that does this" is fine. Silently adding packagess to package.json is not.

## 9.Communication
How you communicate about code matters as mucha as the code itself.

**Say what you did and why.** Don't just dump a osode block. "I moved the validation logic into a sseparate function because it was duplicated in three
endpoints. This also makes it testable indeependently." Now the user understands the change without reading every line.

**Flag concerns.** If you implemented what was asked but you think there's a problem with the appiroach, say so. "This works but it makes a database call for
every item in the list. If the list gets large this will be slow. Want me to batch it?" is the kinnd of proactive communication that saves hours later

**Be precise about what you're uncertain about.** "I'mnot sure if this library supports streaming responses"is useful. "I think this should work" is not.
The difference is that the first one tells theuser exactly what to verify.

**Don't explain things the user already knows.**If they asked you to add a REST endpoint,don't eexplain what REST is. If they asked for a database index,
don't explain what indexes do. Match your explanaation level to the user's demonstrated knowledge.

**Commit messages matter.** If you're writing a ccommit message, make it specific. "Fix bug" is useeless. "Fix null pointer in user lookup when emai1 contains
uppercase chars" tells the next person exadctly what happened.

## 10. Common Failure Modes

These are the patterns I see most often. If you catch yourself doing any of these, stop and reconsider

**The Kitchen Sink.** Asked to add one feature, you restructure half the codebase "while you're at it." Don't. Do the one thing

**The Wrong Abstraction.** You build a beautiful generic solution to a problem that only exists in one place.Duplication is far cheaper than the wrong
abstraction. Copy-paste twice before you abstract.

**The Invisible Decision.** You make an architectural choice (database schema, API shape, auth strateegy) without flagging it as a decision. These choidces
are hard to reverse and the user should ibe aware you made them.

**The Optimistic Path.** You write code that handles thee happy path perfectly and ignores or crashes on everythhing else. Think about what happens when the
API returns 500.When the file doesn't exist.When the user submits an empty form.

**The Knowledge Hallucination.** You confidently use an API that doesn't exist, a parameter that wasremoved two versions ago, or a library feature you're
imagining. If you're not 100%sure a method existswith this exact signature, say so. Check the docs.Look at the actual source code in the project.

**The Style Drift.** You write code in your "preferred" style instead of matching the project. Functional patterns in an OOP codebase. Classes in a
functional codebase. TypeScript patterns in a JavaScript project. Match the codebase, not your preferences

**The Runaway Refactor.** You start fixing one thinng. It touches another thing. That touches another.Twenty minutes later you've changed 15 files and
you're not sure what you originally set out to do. If a fix is cascading, stop. Tell the user what's happening. Get buy-in before contihuing

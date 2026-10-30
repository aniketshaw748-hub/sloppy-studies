# Sloppy Studies · OS + CG scripts v3

**Style** (approved on the producer–consumer test):
1. Read the question.
2. Explain from zero in plain subject terms (no analogies; one real example is fine).
3. Say what the question wants.
4. One idea at a time, each said once.
5. "In your exam, write this."
6. A short trick.

The exact question stays in the bar on screen; the answer card shows what to write.

**Watched in order.** Viewers go through each subject in order (OS 1 → 6, then CG 1 → 12), so a concept that an earlier video already taught is *recalled* in one line ("remember…", "like in question two…"), not explained again. Recalls stay inside one subject.

**Audio tags.** These go in the voice text only; captions strip them.
- `[warm, clear teacher, friendly and patient]` opens every script.
- `[short pause]`: a beat between ideas.
- `[pause]`: before the next question, a big turn, or the exam line.
- `[curious]`: on "what is this about?" moments.
- `[confident]`: on the answer and the exam line.
- `[reassuring]`: on recalls and checks.
- **CAPS:** emphasis on one key word per idea (never 2–3-letter words, which may get spelled out).

**Voices:** OS = Julian, CG = Chloe, both on Eleven v4 Turbo. Pace ≈ 2.55 words per second.

---

## os-q01 · Five short answers (≈1:50)

| Part | On screen | Voice |
|---|---|---|
| Intro | Five numbered cards. | [warm, clear teacher, friendly and patient] Five short questions. One at a time. [pause] |
| Q1 | Four processes in a circle, each holding one resource and pointing at the next one's. The four conditions light up one by one. | Question one: the four conditions of deadlock. [short pause] A deadlock is when a group of processes, that is running programs, are all STUCK, each waiting for something another one holds. It needs four conditions at once. [short pause] Mutual exclusion: a resource, like a printer, can be used by only one process at a time. [short pause] Hold and wait: a process holds one resource while waiting for another. [short pause] No preemption: nothing can be taken away by force. [short pause] Circular wait: the waiting forms a circle. [short pause] Remove any one, and deadlock CAN'T happen. [pause] |
| Q2 | A counter at 5; two processes both read 5, both write 6; "should be 7". | Question two: race condition. [short pause] When two processes change the same data at the same time, the result depends on who goes first. Both read a counter of five, both add one, both write six. [short pause] It should be SEVEN. That's a race condition. [pause] |
| Q3 | A tall program, a small RAM box, a disk; only some pages sit in RAM, one is fetched from disk. | Question three: virtual memory. [short pause] RAM, where running programs live, is limited. Virtual memory lets a program run with only PART of it in RAM. The rest waits on the disk and is loaded only when it's needed. [short pause] So a program can be BIGGER than the RAM itself. [pause] |
| Q4 | A memory bar with scattered small gaps; the blocks slide together; one big gap; "COMPACTION". | Question four: the solution to external fragmentation. [short pause] External fragmentation means free memory is broken into small gaps, so a big program can't fit even though enough space is free in total. [short pause] [confident] The answer is COMPACTION: move the programs together so the gaps join into one big block. [pause] |
| Q5 | A lock on a shared box; process A locks, B waits, A unlocks, B goes in. | Question five: what is a mutex? [short pause] A mutex is a LOCK. Before a process touches shared data, it locks the mutex, and when it's done, it unlocks it. While it's locked, others wait. [short pause] Only the process that locked it can unlock it. [pause] |
| Exam | Two answer cards. | [confident] In your exam, write these five answers. |

## os-q02 · Producer–consumer (≈1:40)
Approved test v3, with recalls added for process, race condition, mutex and deadlock, which the short answers already taught.

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: explain the producer consumer problem. [pause] |
| From zero | Two process windows; one downloads, one plays. Labels: producer, consumer; then a row of five slots between them, labelled buffer. | [curious] First, what is this about? [short pause] Remember, a running program is a process. Often one process makes data while another uses it, like one process downloading a video while another plays it. The one that makes data is the PRODUCER. The one that uses it is the CONSUMER. [short pause] They pass data through a buffer: a small shared area of memory with a fixed number of slots, say five. [pause] |
| What it wants | Two-line checklist. | So the question wants two things: what can go wrong, and how to fix it. [pause] |
| Problems | Full buffer, producer stopped · empty buffer, consumer stopped · both arrows hit at once, "race condition". | Three things can go wrong. [short pause] A FULL buffer has no room, so the producer must wait. [short pause] An EMPTY buffer has nothing to take, so the consumer must wait. [short pause] And if both change the buffer at the same moment, the count gets mixed up: the race condition from the short answers. [pause] |
| Semaphore | A counter box with two buttons, wait and signal. | The fix uses SEMAPHORES: counters that the operating system protects. [short pause] Wait takes one away, and sleeps if it's zero. Signal adds one back, and wakes a sleeper. [pause] |
| Three semaphores | Three counters above the buffer: empty 5, full 0, mutex 1. | We use three. [short pause] Empty counts free slots, starting at five. [short pause] Full counts filled slots, starting at zero. [short pause] And mutex is the lock you already know: one process in at a time, starting at one. [pause] |
| Producer + consumer | The producer's steps light up in order; then the consumer's mirrored steps. | The producer waits on empty to reserve a slot, waits on mutex to get the buffer, puts the item in, then signals mutex and full. [short pause] The consumer does the MIRROR image: wait on full and mutex, take the item, signal mutex and empty. [pause] |
| Trap | The two waits swapped; producer asleep holding mutex. | One trap: [short pause] if the producer locks mutex BEFORE checking empty, it can sleep while holding the buffer, and nobody gets in. That's a deadlock. [pause] |
| Exam + trick | Answer card, then "count first, lock second". | [confident] In your exam, write this. [short pause] And remember: count first, lock second. |

## os-q03 · Semaphores (≈1:30)
Recalls: semaphore, wait/signal, empty/full/mutex (from q02); process (from q01).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: what are semaphores, both types, and how do they help with synchronization? [pause] |
| Recall | The counter box from the producer–consumer video, with wait and signal. | [reassuring] You've already met semaphores in the producer consumer video: a counter the operating system protects, with two actions, wait and signal. [short pause] This question wants a bit more: the exact rules, the two types, and how they keep processes in step. [pause] |
| Sync | Two processes reaching for one shared box; a wrong result. | Synchronization means controlling which process uses a shared thing, and WHEN, so results don't go wrong. [pause] |
| Exact rules | P and V labels; one unbroken step. | Wait is also called P. It takes one away, and if the value is zero, the process sleeps. [short pause] Signal is also called V. It adds one back and wakes a sleeping process. [short pause] Each one happens in a single step that can't be INTERRUPTED, so two processes can never change the count at once. [pause] |
| Two types | Counting: a 3 with three printers; empty and full. Binary: a 1 with a lock; mutex. | There are two types. [short pause] A COUNTING semaphore can hold any number. You start it at the number of identical resources, like three printers. Empty and full were counting semaphores. [short pause] A BINARY semaphore is only zero or one, so it works like a lock. The mutex was a binary semaphore. [pause] |
| Three uses | Three rows: start 1 (one inside at a time), start 0 (task B waits for task A), start N (at most N users). | How does it give synchronization? Three ways. [short pause] Mutual exclusion: start at ONE. Each process waits before using the shared data and signals after, so only one is inside at a time. [short pause] Ordering: start at ZERO. If task B must run after task A, B waits, and A signals when it's done. [short pause] Counting: start at N, to let at most N processes use a pool. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: start at one to lock, zero to wait, N to count. |

## os-q04 · Memory management basics (≈1:35)
Recalls: process, RAM (q01–q02); external fragmentation, virtual memory (q01).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: discuss the basic concepts of memory management. [pause] |
| From zero | RAM bar with several processes inside it. | [curious] First, what is this about? [short pause] Remember, RAM is where processes live while they run. Memory management is the operating system's job of deciding WHERE each process goes, tracking free space, and stopping processes from touching each other's memory. [short pause] The question wants the basic ideas. There are five. [pause] |
| Addresses | A program counting from 0; the MMU adds the base; the real RAM address. | One: addresses. [short pause] A program uses its own addresses starting from zero. These are LOGICAL addresses. The real places in RAM are PHYSICAL addresses. A piece of hardware called the memory management unit converts them, by adding where the process starts, called the base. [pause] |
| Protection | A limit gate; an address past it is stopped. | Two: protection. [short pause] A limit register holds the size of the process, and any address beyond it is STOPPED. [pause] |
| Swapping | A process moves out to disk and back. | Three: swapping. [short pause] A process can be moved out to disk and brought back later, to make room. [pause] |
| Allocation | Blocks with gaps between (external) and inside (internal). | Four: allocation. [short pause] If each process gets one continuous block, gaps appear. Gaps BETWEEN blocks are the external fragmentation you saw in the short answers. Unused space INSIDE a block is internal fragmentation. [pause] |
| Paging, segmentation | Equal pages scattered into any frames; then unequal parts named code, data, stack. | Five: paging and segmentation. [short pause] Paging cuts a process into EQUAL pieces that can go anywhere, so the gaps between blocks stop mattering. It's also what virtual memory is built on. [short pause] Segmentation cuts it into LOGICAL parts, like code and data. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: addresses, protection, swapping, allocation, paging. |

## os-q05 · First, best, worst fit (≈1:30)
Recalls: the gaps from contiguous allocation (q04).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: explain first fit, best fit and worst fit. [pause] |
| Recall | Memory with free gaps labelled "holes"; a process waiting for space. | [reassuring] Remember from the last video: when each process gets one continuous block, free gaps appear. These gaps are called HOLES. [short pause] When a new process arrives, these three methods decide which hole it gets. [pause] |
| Rules | Three short rules appear. | First fit takes the FIRST hole that's big enough. [short pause] Best fit takes the SMALLEST hole that's big enough. [short pause] Worst fit takes the BIGGEST hole. [pause] |
| Example | Holes 100, 500, 200, 300, 600; requests 212, 417, 112, 426. | Let's try all three. [short pause] The holes are one hundred, five hundred, two hundred, three hundred and six hundred K. The processes need two twelve, four seventeen, one twelve and four twenty-six K. [pause] |
| First fit | The blocks drop in; 426 waits. | First fit: [short pause] two twelve goes into the five hundred. Four seventeen into the six hundred. One twelve into what's left of the five hundred. And four twenty-six finds no hole big enough, so it WAITS. [pause] |
| Best fit | All four fit. | Best fit: [short pause] two twelve takes the three hundred, four seventeen the five hundred, one twelve the two hundred, and four twenty-six the six hundred. [confident] EVERYTHING fits. [pause] |
| Worst fit | 426 waits again. | Worst fit: [short pause] two twelve takes the six hundred, four seventeen the five hundred, one twelve what's left of the six hundred, and four twenty-six waits again. [pause] |
| Verdict | Scoreboard. | So here, best fit wins. [short pause] First fit is FASTEST, because it stops searching early. Best fit leaves tiny leftovers that are hard to use. Worst fit tries to keep leftovers big enough to be useful. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: first, smallest, biggest. |

## os-q06 · Banker's algorithm (≈2:05)
Recalls: deadlock (q01).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar with the snapshot table. | [warm, clear teacher, friendly and patient] Today's question: from this snapshot, find the need matrix, check whether the system is safe, and decide whether P1's request can be granted right away. [pause] |
| Recall + setup | Four resource bins A–D; five processes with what they hold and their maximum. | [reassuring] You know deadlock from the short answers: processes stuck, each waiting for another. The banker's algorithm AVOIDS it. It only hands out resources if every process can still finish. [short pause] Here, five processes share four types of resources, A, B, C and D. Allocation is what each process holds now. Max is the most it could ever ask for. Available is what's still free: one, five, two, zero. [pause] |
| Part 1 · Need | The empty part of each Max outline fills in. | Part one: [short pause] need is max MINUS allocation. P0 needs nothing more. P1 needs zero, seven, five, zero. P2 needs one, zero, zero, two. P3 needs zero, zero, two, zero. P4 needs zero, six, four, two. [pause] |
| Part 2 · Safety | The free pile grows as processes finish; P1 is skipped once. | Part two: is it safe? [short pause] Look for a process whose need fits in what's free. It finishes and gives back EVERYTHING it holds. Repeat. [short pause] P0 needs nothing, so it finishes, and free becomes one, five, three, two. [short pause] P1 needs seven B, but only five are free, so skip it. [short pause] P2 fits, finishes, and free becomes two, eight, eight, six. [short pause] Now P1 fits, and free becomes three, eight, eight, six. P3 and P4 finish too. [short pause] [confident] Everyone can finish, so the system is SAFE, in the order P0, P2, P1, P3, P4. [pause] |
| Part 3 · Request | P1's request moves over in a dashed "pretend" state; the safety run repeats; "GRANT". | Part three: [short pause] P1 asks for zero, four, two, zero. It's within its need, and it's free right now, so PRETEND to give it. Free drops to one, one, zero, zero. [short pause] Run the safety check again: P0, P2, P1, P3 and P4 all still finish. [short pause] [confident] It's still safe, so yes, grant it immediately. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: need is max minus allocation. Finish, give back, repeat. |

---

## cg-q01 · Window to viewport (≈1:15)

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: find the matrix that maps a window onto a viewport. [pause] |
| From zero | A picture; a rectangle marks the part we want (window); a small square on the screen (viewport). | [curious] First, the words. [short pause] In graphics, the WINDOW is the part of the picture we want to show. Here it's the rectangle from two, two to six, ten. [short pause] The VIEWPORT is where it goes on the screen, here the square from zero, zero to one, one. [short pause] We need one matrix that fits the window exactly into the viewport. [pause] |
| Step 1 | The window slides to the origin. | It takes three moves. [short pause] First, SLIDE the window so its corner sits at zero: subtract two from x and two from y. [pause] |
| Step 2 | The window squashes to 1 by 1. | Second, RESIZE it. The window is four wide and eight tall, and the viewport is one by one, so divide x by four and y by eight. [pause] |
| Step 3 | The viewport corner is already at the origin. | Third, slide it to the viewport's corner. That corner is already zero, zero, so there's nothing to do. [pause] |
| Result | x′ = (x − 2)/4, y′ = (y − 2)/8, then the matrix. | So the new x is x minus two, over four, and the new y is y minus two, over eight. Those two rules are the rows of the matrix. [short pause] [reassuring] Check: the corner six, ten lands on one, one. [pause] |
| Exam + trick | Answer card. | [confident] In your exam, write this. [short pause] Remember: slide, resize, slide. |

## cg-q02 · Reflect about y = x + 1 (≈1:10)
Recalls: sliding first to make the problem easy (q01).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; the triangle and the line. | [warm, clear teacher, friendly and patient] Today's question: reflect the triangle A two, two, B three, three, C six, five about the line y equals x plus one. [pause] |
| From zero | One point jumps across a mirror line. | REFLECTING means making a mirror image: each point jumps straight across the line and lands the same distance on the other side. [pause] |
| The idea | The line y = x; then y = x + 1, one unit higher. | Reflecting in the line y equals x is easy: just SWAP x and y. [short pause] Our line, y equals x plus one, is that same line moved up by one. [pause] |
| Plan | Everything slides down 1, swaps, slides back up. | So we use the same trick as the window question: slide first, so the problem becomes easy. [short pause] Move everything DOWN by one, so the mirror becomes y equals x. Swap x and y. Then move everything back UP by one. [pause] |
| Rule | (x, y) → (x, y − 1) → (y − 1, x) → (y − 1, x + 1). | Following one point through, x, y becomes y minus one, x plus one. That's the whole rule. [pause] |
| Answer | A′(1, 3), B′(2, 4), C′(4, 7). | [confident] So A goes to one, three. B goes to two, four. C goes to four, seven. [short pause] |
| Check | Midpoint (5, 6) on the line. | [reassuring] Check: halfway between C and its image is five, six, and that lies on the line. [pause] |
| Exam + trick | Answer card. | [confident] In your exam, write this. [short pause] Remember: move down, swap, move back. |

## cg-q03 · Rotate, translate, scale (≈0:50)
Recalls: sliding and resizing (q01).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; the point (20, 30). | [warm, clear teacher, friendly and patient] Today's question: the point twenty, thirty is rotated ninety degrees anticlockwise, then moved by minus twenty, zero, then scaled by two, one. Where does it end up? [pause] |
| Idea | Three steps, each feeding the next. | We do the three steps in ORDER, each on the result of the last. [pause] |
| Rotate | Arc to (−30, 20). | Rotating ninety degrees anticlockwise around the origin turns x, y into minus y, x. [short pause] So twenty, thirty becomes minus thirty, twenty. [pause] |
| Translate | Slide to (−50, 20). | Translating is the SLIDE you've already seen: add minus twenty to x. That gives minus fifty, twenty. [pause] |
| Scale | Stretch to (−100, 20). | Scaling is the RESIZE step: multiply x by two and y by one. [confident] That gives minus one hundred, twenty. [pause] |
| Matrix | S · T · R. | As matrices, multiply in REVERSE order: scale times translate times rotate. Same answer. [pause] |
| Exam + trick | Answer card. | [confident] In your exam, write this. [short pause] Remember: each step works on the last result. |

## cg-q04 · Cohen–Sutherland (≈1:30)
Recalls: window (q01).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; the window and two lines. | [warm, clear teacher, friendly and patient] Today's question: use the Cohen Sutherland algorithm to clip two lines against a window. [pause] |
| From zero | The window x 50–80, y 10–40; parts of the lines outside fade. | [reassuring] Remember, the window is the part of the picture we want to show. [short pause] CLIPPING means keeping only the part of a line that's inside it, and cutting the rest away. Here the window runs from fifty to eighty in x, and ten to forty in y. [pause] |
| Codes | A point moving around; four bits light up: top, bottom, right, left. | Cohen Sutherland gives each end of a line a four-digit CODE. [short pause] Each digit answers one question: is the point above the window, below it, to the right, or to the left? One means yes. All zeros means inside. [pause] |
| Rules | Three mini lines: keep, throw away, cut. | Then three rules. [short pause] If both ends are all zeros, the line is inside: KEEP it. [short pause] If both ends have a one in the same position, the line is completely outside on that side: THROW it away. [short pause] Otherwise, CUT the line at the window's edge and check again. [pause] |
| Line 1 | P1(40, 15) left, P2(75, 45) above; the cuts. | Line one goes from forty, fifteen to seventy-five, forty-five. [short pause] The first end is left of the window, the second is above it. They share no one, so we cut. [short pause] The slope is six sevenths. Cutting at x equals fifty gives y about twenty-three point five seven. Cutting at y equals forty gives x about sixty-nine point one seven. [short pause] The part between those two points is kept. [pause] |
| Line 2 | P3(70, 20) inside, P4(100, 10) right; the cut. | Line two goes from seventy, twenty, which is inside, to a hundred, ten, which is to the right. [short pause] The slope is minus one third. Cutting at x equals eighty gives y about sixteen point six seven. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: code, test, cut, repeat. |

## cg-q05 · Two scalings multiply (≈0:55)
Recalls: scaling (q03), matrices of transformations (q03).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: show that two scalings in a row are multiplicative. [pause] |
| Meaning | (1, 1) → (2, 3) → (8, 15), then one scaling (8, 15). | [reassuring] Scaling, remember, multiplies x by one number and y by another. [short pause] MULTIPLICATIVE means two scalings in a row equal one scaling by the products. [short pause] Scale the point one, one by two and three, then by four and five: it goes to two, three, then eight, fifteen. [short pause] A single scaling by eight and fifteen lands on the SAME point, since two times four is eight and three times five is fifteen. [pause] |
| Proof | Two diagonal matrices multiply into one. | To prove it in general, write each scaling as a matrix. A scaling matrix has numbers only on its DIAGONAL. [short pause] Multiply two of them, and the diagonal numbers simply multiply, while everything else stays zero. The result is another scaling. [short pause] And since the order of multiplying numbers doesn't matter, neither does the order of the scalings. [pause] |
| Exam + trick | Answer card. | [confident] In your exam, write this. [short pause] Remember: the stretch factors multiply. |

## cg-q06 · Liang–Barsky (≈1:15)
Recalls: window, clipping (q04).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; window and line. | [warm, clear teacher, friendly and patient] Today's question: clip the line from A minus one, seven to B eleven, one, against the window from one to nine in x and two to eight in y, using Liang Barsky. [pause] |
| Recall + idea | A dot moving from A (u = 0) to B (u = 1). | [reassuring] This is the same job as Cohen Sutherland: keep only the part of the line inside the window. Liang Barsky just does it a different way. [short pause] It treats the line as a MOVING point. A number u goes from zero at A to one at B. Here x is minus one plus twelve u, and y is seven minus six u. [pause] |
| Edge limits | Each edge lights with its ratio. | Each of the four edges of the window gives one LIMIT on u. For each edge we work out two numbers, p and q, and divide them. [short pause] Left edge: one sixth. Right edge: five sixths. Bottom edge: five sixths. Top edge: minus one sixth. [pause] |
| Enter/leave | A number line: entry marks at 1/6 and −1/6, exit marks at 5/6. | When p is negative, the line is ENTERING through that edge. When p is positive, it's LEAVING. [short pause] The visible part starts at the latest entry, one sixth, and ends at the earliest exit, five sixths. [pause] |
| Answer | u = 1/6 → (1, 6), u = 5/6 → (9, 2). | Put those back in. One sixth gives the point one, six. Five sixths gives nine, two. [short pause] [confident] So the clipped line runs from one, six to nine, two. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: enter late, leave early. |

## cg-q07 · Parametric vs geometric continuity (≈1:35)
Recalls: a parameter moving a point along a line (u in q06).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: what's the difference between parametric and geometric continuity, and when would an engineer choose geometric? [pause] |
| From zero | A curve made of two joined pieces; a point moving along it. | [curious] First, what is this about? [short pause] Curves in graphics are often built from PIECES joined end to end. [short pause] Each piece is drawn with a parameter, t, just like u in Liang Barsky: as t increases, a point moves along the curve. [short pause] Continuity describes how SMOOTHLY two pieces join. [pause] |
| C | At the joint: arrows equal in direction and length. | Parametric continuity, C, compares the formulas. [short pause] C zero: the pieces meet. C one: at the joint, the moving point's direction AND speed are exactly equal. C two: its acceleration matches too. [pause] |
| G | Same direction, different length; then matching bend. | Geometric continuity, G, compares only the SHAPE. [short pause] G zero: they meet. G one: the direction matches, but the speed can differ. G two: the bend, called curvature, matches. [pause] |
| Relation | C ⇒ G, not the reverse. | So C is STRICTER. Anything that's C one is also G one, but not the other way round. [pause] |
| When G | Car body, font outline, pieces of different lengths. | An engineer chooses G when only the shape matters: car bodies, product surfaces, font outlines, or joining pieces of different lengths. [short pause] It's smooth to the eye, with more FREEDOM to shape it. [pause] |
| When C | A camera moving along a path; a robot arm. | They choose C when the parameter really is TIME, like a camera moving along a path or a robot arm, where a sudden change in speed would be a jolt. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: G is shape, C is shape plus speed. |

## cg-q08 · Composite: scale, rotate, reflect (≈1:05)
Recalls: scaling, rotation, "multiply in reverse order" (q03); reflection (q02).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; the square. | [warm, clear teacher, friendly and patient] Today's question: a square with corners O zero, zero, B four, zero, C four, four and D zero, four is scaled by half, rotated ninety degrees clockwise, then reflected about the origin. Find the result. [pause] |
| Recall | Three steps in a row. | [reassuring] Composite just means several transformations in a row, like question three. You've seen scaling, rotation and reflection already. [pause] |
| Scale | Square halves. | Step one, scale by half: every coordinate HALVES. [short pause] B becomes two, zero. C two, two. D zero, two. [pause] |
| Rotate | Square swings clockwise. | Step two, rotate ninety degrees CLOCKWISE: x, y becomes y, minus x. [short pause] B becomes zero, minus two. C two, minus two. D two, zero. [pause] |
| Reflect | Square hops through the origin. | Step three, reflect about the origin: flip BOTH signs. [short pause] B becomes zero, two. C minus two, two. D minus two, zero. O stays at zero, zero the whole time. [pause] |
| Combined | M = T3 · T2 · T1; net = half size + 90° anticlockwise. | As one matrix, multiply in reverse order, as before: T three times T two times T one. [short pause] Overall, a clockwise quarter turn followed by a half turn is an ANTICLOCKWISE quarter turn. [confident] So the square ends up half size and turned ninety degrees anticlockwise. [pause] |
| Exam + trick | Answer card. | [confident] In your exam, write this. [short pause] Remember: apply in order, multiply in reverse. |

## cg-q09 · Two reflections (≈1:15)
Recalls: reflection and the swap trick for y = x (q02).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; the triangle and both lines. | [warm, clear teacher, friendly and patient] Today's question: reflect the triangle A zero, zero, B one, one, C five, three, first about the x axis, then about the line y equals minus x, and explain what happened overall. [pause] |
| First mirror | Flip across the x axis. | Reflecting about the x axis flips the sign of y. [short pause] A stays at zero, zero. B becomes one, minus one. C becomes five, minus three. [pause] |
| Second mirror | Flip across y = −x. | [reassuring] Remember, reflecting in y equals x swaps the coordinates. For y equals MINUS x, swap them AND flip both signs. [short pause] B, at one, minus one, stays put, because it sits on that line. C goes from five, minus three to three, minus five. [pause] |
| Answer | A′(0, 0), B′(1, −1), C′(3, −5). | [confident] So the final triangle is A zero, zero, B one, minus one, C three, minus five. [pause] |
| Overall | (x, y) → (y, −x): a 90° clockwise turn; the 45° angle between the lines. | Overall, a point x, y becomes y, minus x. That's a ROTATION of ninety degrees clockwise about the origin. [short pause] Two reflections in lines that cross always make a rotation, by TWICE the angle between them. Here the lines are forty-five degrees apart, so the turn is ninety. [short pause] And because two flips cancel out, the triangle isn't mirrored; its shape and size stay the same. [pause] |
| Exam + trick | Answer card. | [confident] In your exam, write this. [short pause] Remember: two mirrors make a turn. |

## cg-q10 · Reflect about 2x − 8y + 4 = 0 (≈1:30)
Recalls: reflection and the slide-first plan (q02); rotation (q03).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; the square and the line. | [warm, clear teacher, friendly and patient] Today's question: reflect the square P two, two, Q five, two, R two, five, S five, five about the line two x minus eight y plus four equals zero. [pause] |
| The line | y = x/4 + ½; crosses at ½, slope ¼. | Rearranged, the line is y equals x over four, plus a half. It crosses the y axis at a half and rises with a slope of one quarter. [pause] |
| Recall + plan | Move down ½, rotate flat, flip, rotate back, move up. | [reassuring] This is question two again, with a harder mirror. Same plan: turn it into an EASY mirror, flip, then undo. [short pause] The easiest mirror is the x axis. So move everything down by a half, so the line passes through the origin. ROTATE everything so the line lies flat along the x axis. Flip across the x axis. Then rotate back, and move back up. [pause] |
| Matrix | tan θ = ¼; cos 2θ = 15/17, sin 2θ = 8/17; M. | The line's angle, theta, has tan theta equal to one quarter. [short pause] The middle three steps combine into one matrix built from cos two theta, which is fifteen seventeenths, and sin two theta, eight seventeenths. Adding the two moves gives the full matrix. [pause] |
| Answer | P′, Q′, R′, S′. | Multiply each corner by it. [short pause] [confident] P goes to about two point four seven, zero point one two. Q to five point one two, one point five three. R to three point eight eight, minus two point five three. S to six point five three, minus one point one two. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: move, rotate flat, flip, rotate back, move back. |

## cg-q11 · Tilted window to unit square (≈1:05)
Recalls: window-to-viewport steps (q01); rotation (q03).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar; the tilted rectangle. | [warm, clear teacher, friendly and patient] Today's question: find the matrix that maps the window A one, one, B five, three, C four, five, D zero, three onto the unit square. [pause] |
| Recall | The rectangle, tilted; its two edges. | [reassuring] This is the window to viewport question from the start, but this window is TILTED. [short pause] Edge A B goes four across and two up. Edge A D goes one back and two up. They meet at a right angle. [pause] |
| Three steps | Slide A to 0; rotate AB flat; shrink to 1 by 1. | So we add one step: slide, ROTATE, resize. [short pause] First, slide A to the origin: subtract one from x and one from y. [short pause] Second, rotate the rectangle so edge A B lies flat along the x axis; its angle theta has tan theta equal to one half. [short pause] Third, resize: edge A B is two root five long and edge A D is root five, so divide by those to make both sides one. [pause] |
| Result | N. | Multiplying the three matrices gives N. [pause] |
| Check | A → (0,0), B → (1,0), C → (1,1), D → (0,1). | [reassuring] Check: A goes to zero, zero, B to one, zero, C to one, one, and D to zero, one. [confident] Exactly the unit square. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: move, untilt, resize. |

## cg-q12 · Curves and the natural cubic spline (≈1:40)
Recalls: the parameter t, pieces joined end to end, C1/C2 (q07).

| Part | On screen | Voice |
|---|---|---|
| Question | Question bar. | [warm, clear teacher, friendly and patient] Today's question: what is a curve, how do we draw a smooth one, and what is a natural cubic spline? [pause] |
| Curve | A point tracing a loop; x(t), y(t). | A curve is a continuous line of points: the PATH a moving point traces. [short pause] [reassuring] Like in the continuity video, we describe it with a parameter, t: x is a formula in t, and y is a formula in t. That handles loops and any direction. [pause] |
| Smooth | One big formula wiggling; then short smooth pieces. | To draw a smooth curve through some points, one big formula through all of them tends to WIGGLE wildly. [short pause] Instead we use a SPLINE: short pieces joined smoothly. Cubic pieces, of degree three, are the usual choice. [pause] |
| Count | n + 1 points, n pieces, 4n unknowns; the equations stack. | A natural cubic spline passes through every point. [short pause] With n plus one points there are n pieces, and each cubic piece has four unknown numbers, so four n unknowns. [short pause] Each piece passes through its two end points: two n equations. At each inner joint the slopes match and the bends match, which is C one and C two continuity: two times n minus one more. [short pause] That's four n minus two. [pause] |
| Natural | The bend is zero at both ends. | The last two come from the word NATURAL: the bend is zero at both ends. Now the count matches. [pause] |
| Draw + catch | Solve once, draw in small steps; moving one point moves everything. | Solve those equations once, then draw each piece in small steps. [short pause] The result is very smooth, but moving ONE point changes the whole curve. [pause] |
| Exam + trick | Answer cards. | [confident] In your exam, write this. [short pause] Remember: four n unknowns, four n conditions. |

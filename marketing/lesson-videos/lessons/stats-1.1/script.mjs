// Narration for stats-1.1 "What Can We Learn from Data?". Every fact comes from the lesson cards in
// app/src/content/stats/u1.ts (and the lesson's extra prose in stats/book.ts). One entry per sentence:
// the voice reads `say`; captions show `cap` (or `say` when there is no `cap`). `gap` = seconds of
// silence after the sentence (default 0.35).
export default {
  id: 'stats-1.1',
  title: 'What Can We Learn from Data?',
  course: 'AP® Statistics',
  unit: 'Unit 1 · Exploring One-Variable Data and Collecting Data',
  unitId: 'stats-u1', // with unitTitle, names the folder the video is stored under
  unitTitle: 'Exploring One-Variable Data and Collecting Data',
  voice: 'am_michael',
  speed: 1.0,
  scenes: [
    { id: 'intro', lead: 1.6, beats: [
      { say: 'What can we learn from data?', gap: 0.5 },
      { say: "In the next few minutes, you'll learn the parts of a statistical study, what makes a good investigative question, and how to answer in context.", gap: 0.8 },
    ] },
    { id: 'hook', beats: [
      { say: "Let's start with a question." },
      { say: 'How much time do teens in your country spend on screens each day?', gap: 0.5 },
      { say: "You can't ask every teen.", gap: 0.5 },
      { say: 'But ask a well-chosen few hundred, and you can say something trustworthy about millions.', gap: 0.6 },
      { say: 'That is what statistics is for.', gap: 0.9 },
    ] },
    { id: 'parts', beats: [
      { say: 'Every statistical study has the same parts.' },
      { say: 'A statistical study collects data from a sample, to answer an investigative question about a larger population.', gap: 0.6 },
      { say: 'The population is all the items or individuals of interest. Its size is written as a capital N.', cap: 'The population is all the items or individuals of interest. Its size is written as a capital N.', gap: 0.5 },
      { say: 'The sample is the subset we actually get data from. Its size is a lowercase n.', cap: 'The sample is the subset we actually get data from. Its size is a lowercase n.', gap: 0.5 },
      { say: 'One piece of information about one individual is called a datum.', gap: 0.4 },
      { say: 'Many data make a data set.', gap: 0.6 },
      { say: 'So when do we need a study? When the population is too large, or when it is too difficult to collect data from every member.', gap: 0.9 },
    ] },
    { id: 'process', beats: [
      { say: 'Every investigation in this course follows the same four stages.', gap: 0.4 },
      { say: 'One: ask an investigative question about a population.', gap: 0.4 },
      { say: 'Two: collect data in a way that can answer it.', gap: 0.4 },
      { say: 'Three: analyze the data, with graphs and summary statistics.', gap: 0.4 },
      { say: 'Four: interpret the results, and answer the original question, in context.', gap: 0.6 },
      { say: 'The conclusion must answer the question that was asked, about the population that was actually sampled.', gap: 0.9 },
    ] },
    { id: 'question', beats: [
      { say: 'It all starts with the investigative question.' },
      { say: 'A good one does two things.', gap: 0.4 },
      { say: 'First, it has a defined purpose, set before you look at the data.', gap: 0.4 },
      { say: 'It is never changed to fit the results.', gap: 0.6 },
      { say: 'Second, it is posed so that the needed data can actually be collected and analyzed.', gap: 0.6 },
      { say: "Here's a weak question: are phones bad?", cap: 'Here\'s a weak question: "Are phones bad?"', gap: 0.5 },
      { say: "And here's a better one: what is the mean daily screen time of students at our school?", cap: 'And here\'s a better one: "What is the mean daily screen time of students at our school?"', gap: 0.9 },
    ] },
    { id: 'example', beats: [
      { say: "Let's name the parts in an example." },
      { say: "A gym manager randomly selects sixty of the gym's members who use the pool, and asks how satisfied they are with the pool hours.", cap: "A gym manager randomly selects 60 of the gym's members who use the pool, and asks how satisfied they are with the pool hours.", gap: 0.6 },
      { say: "The population is all members of this gym who use the pool. That's the group the question is about.", gap: 0.5 },
      { say: 'The sample is the sixty pool-using members who were selected. They are the ones we get data from.', cap: 'The sample is the 60 pool-using members who were selected. They are the ones we get data from.', gap: 0.5 },
      { say: 'So lowercase n is sixty.', cap: 'So n = 60.', gap: 0.4 },
      { say: 'Capital N, the number of all pool users, is unknown. And that is normal.', cap: 'N, the number of all pool users, is unknown. And that is normal.', gap: 0.9 },
    ] },
    { id: 'trap', beats: [
      { say: 'Now, a trap to avoid.' },
      { say: "Don't make the population too wide.", gap: 0.5 },
      { say: 'Only pool users could be selected. So the population is pool users.', gap: 0.5 },
      { say: 'It is not all members, and it is not all people.', gap: 0.9 },
    ] },
    { id: 'context', beats: [
      { say: "Here's a habit that pays off on the exam: answer in context.", gap: 0.4 },
      { say: 'The readers who score your answers want every statistical word tied to the story.', gap: 0.5 },
      { say: "Don't just write: the population. Write: all pool-using members of the gym.", cap: 'Don\'t just write "the population". Write "all pool-using members of the gym".', gap: 0.5 },
      { say: "Don't just write: the mean. Write: the mean daily screen time of the sampled teens.", cap: 'Don\'t just write "the mean". Write "the mean daily screen time of the sampled teens".', gap: 0.5 },
      { say: 'When in doubt, add who, and what.', gap: 0.9 },
    ] },
    { id: 'try', beats: [
      { say: 'Your turn.' },
      { say: 'A city wants to know the average commute time of all of its two million adult residents. Why is a statistical study needed?', cap: 'A city wants to know the average commute time of all of its 2 million adult residents. Why is a statistical study needed?', gap: 0.5 },
      { say: 'Is it because statistical studies are always required by law?', gap: 0.3 },
      { say: 'Because collecting data from every adult resident would be too difficult?', gap: 0.3 },
      { say: 'Because a study guarantees every resident is included?', gap: 0.3 },
      { say: 'Or because a study avoids collecting any data from residents?', gap: 0.4 },
      { say: 'Pause the video if you need a moment.', gap: 3.6 },
      { say: 'The answer is choice B.', gap: 0.4 },
      { say: 'The population is huge, so getting data from every adult is too difficult.', gap: 0.3 },
      { say: 'A study uses a sample instead.', gap: 0.4 },
      { say: 'A study that included everyone would be a census.', gap: 0.9 },
    ] },
    { id: 'recap', beats: [
      { say: "Let's recap." },
      { say: 'A study uses a sample, of size lowercase n, to answer a question about a population, of size capital N.', cap: 'A study uses a sample (size n) to answer a question about a population (size N).', gap: 0.5 },
      { say: 'Studies are needed when the population is too big, or too hard to reach fully.', gap: 0.5 },
      { say: 'Set the investigative question before the analysis, and answer in context.', gap: 0.9 },
    ] },
    { id: 'outro', tail: 2.2, beats: [
      { say: 'Ready to practice? Find this lesson, with flashcards and quick checks, at easy I Q dot app.', cap: 'Ready to practice? Find this lesson, with flashcards and quick checks, at eziq.app.' },
    ] },
  ],
}
